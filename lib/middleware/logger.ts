import { NextRequest, NextResponse } from 'next/server';

export interface RequestLog {
    timestamp: string;
    method: string;
    url: string;
    ip: string;
    userAgent: string;
    duration: number;
    status: number;
}

// Simple request logger
export function withLogger(
    handler: (request: NextRequest) => Promise<NextResponse>
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        const startTime = Date.now();

        // Get request info
        const method = request.method;
        const url = request.url;
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        try {
            // Execute handler
            const response = await handler(request);

            // Calculate duration
            const duration = Date.now() - startTime;

            // Log request
            const log: RequestLog = {
                timestamp: new Date().toISOString(),
                method,
                url,
                ip,
                userAgent,
                duration,
                status: response.status,
            };

            // Log to console (in production, send to logging service)
            console.log(
                `[${log.timestamp}] ${log.method} ${url} - ${log.status} - ${log.duration}ms - ${log.ip}`
            );

            return response;
        } catch (error) {
            const duration = Date.now() - startTime;

            console.error(
                `[${new Date().toISOString()}] ${method} ${url} - ERROR - ${duration}ms - ${ip}`,
                error
            );

            throw error;
        }
    };
}
