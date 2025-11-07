import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { vastuCheckSchema } from '@/lib/validation';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    validationErrorResponse,
} from '@/lib/response';
import { z } from 'zod';

// Vastu rules based on traditional principles
const VASTU_RULES = {
    Kitchen: ['Southeast', 'Northwest'],
    Bedroom: ['Southwest', 'Northwest', 'West'],
    'Master Bedroom': ['Southwest'],
    'Living Room': ['Northeast', 'North', 'East'],
    Bathroom: ['Northwest', 'Southeast', 'West'],
    'Pooja Room': ['Northeast'],
    'Study Room': ['Northeast', 'East', 'North', 'West'],
    'Dining Room': ['West', 'East', 'Northwest'],
    'Store Room': ['Southwest', 'Northwest'],
    Balcony: ['North', 'East', 'Northeast'],
    Entrance: ['North', 'East', 'Northeast'],
} as const;

interface Room {
    name: string;
    type: string;
    direction: string;
    position: {
        x: number;
        y: number;
    };
}

interface VastuAnalysis {
    room: string;
    type: string;
    currentDirection: string;
    idealDirections: string[];
    isCompliant: boolean;
    recommendation: string;
    severity: 'critical' | 'moderate' | 'minor' | 'compliant';
}

function calculateVastuScore(rooms: Room[]) {
    let score = 0;
    const totalRooms = rooms.length;
    const analysis: VastuAnalysis[] = [];
    const criticalRooms = ['Kitchen', 'Master Bedroom', 'Pooja Room', 'Entrance'];

    rooms.forEach((room) => {
        const idealDirections = VASTU_RULES[room.type as keyof typeof VASTU_RULES] || [];
        const isCompliant = idealDirections.includes(room.direction);

        if (isCompliant) {
            score += 1;
        }

        // Determine severity
        let severity: VastuAnalysis['severity'] = 'compliant';
        if (!isCompliant) {
            if (criticalRooms.includes(room.type)) {
                severity = 'critical';
            } else if (['Bedroom', 'Living Room'].includes(room.type)) {
                severity = 'moderate';
            } else {
                severity = 'minor';
            }
        }

        analysis.push({
            room: room.name,
            type: room.type,
            currentDirection: room.direction,
            idealDirections,
            isCompliant,
            severity,
            recommendation: getRecommendation(room, idealDirections, isCompliant, severity),
        });
    });

    const vastuScore = totalRooms > 0 ? Math.round((score / totalRooms) * 100) : 0;
    const vastuCompliant = vastuScore >= 70;

    // Generate overall recommendations
    const overallRecommendations = generateOverallRecommendations(analysis);

    return {
        vastuScore,
        vastuCompliant,
        analysis,
        summary: {
            totalRooms,
            compliantRooms: score,
            nonCompliantRooms: totalRooms - score,
            criticalIssues: analysis.filter((a) => a.severity === 'critical').length,
            moderateIssues: analysis.filter((a) => a.severity === 'moderate').length,
            minorIssues: analysis.filter((a) => a.severity === 'minor').length,
        },
        recommendations: overallRecommendations,
    };
}

function getRecommendation(
    room: Room,
    idealDirections: string[],
    isCompliant: boolean,
    severity: VastuAnalysis['severity']
): string {
    if (isCompliant) {
        return `✅ ${room.type} is correctly placed in ${room.direction} direction according to Vastu principles.`;
    }

    const severityPrefix = severity === 'critical' ? '🚨 CRITICAL: ' : severity === 'moderate' ? '⚠️ ' : 'ℹ️ ';

    return `${severityPrefix}${room.type} should ideally be placed in ${idealDirections.join(' or ')} direction. Current placement in ${room.direction} may affect ${getAffectedAspect(room.type)}.`;
}

function getAffectedAspect(roomType: string): string {
    const aspects: { [key: string]: string } = {
        Kitchen: 'health and prosperity',
        'Master Bedroom': 'relationships and stability',
        'Pooja Room': 'spiritual growth and peace',
        Entrance: 'overall energy flow',
        'Living Room': 'family harmony',
        Bathroom: 'energy balance',
        'Study Room': 'concentration and learning',
    };

    return aspects[roomType] || 'overall energy';
}

function generateOverallRecommendations(analysis: VastuAnalysis[]): string[] {
    const recommendations: string[] = [];

    const criticalIssues = analysis.filter((a) => a.severity === 'critical');
    if (criticalIssues.length > 0) {
        recommendations.push(
            `Priority Fix: Address ${criticalIssues.map((i) => i.type).join(', ')} placement as these are critical for Vastu compliance.`
        );
    }

    const nonCompliantCount = analysis.filter((a) => !a.isCompliant).length;
    if (nonCompliantCount > analysis.length / 2) {
        recommendations.push(
            'Consider a comprehensive redesign to improve overall Vastu compliance and energy flow.'
        );
    }

    if (analysis.some((a) => a.type === 'Kitchen' && !a.isCompliant)) {
        recommendations.push(
            'Kitchen placement significantly impacts health and prosperity. Consider relocating to Southeast or Northwest.'
        );
    }

    return recommendations;
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifyToken(request);

        if (!user) {
            return unauthorizedResponse();
        }

        const body = await request.json();
        const validatedData = vastuCheckSchema.parse(body);

        // Calculate Vastu compliance
        const result = calculateVastuScore(validatedData.rooms);

        return successResponse(result);
    } catch (error) {
        console.error('Vastu check error:', error);

        if (error instanceof z.ZodError) {
            return validationErrorResponse(error);
        }

        return errorResponse('Failed to perform Vastu analysis', 500);
    }
}
