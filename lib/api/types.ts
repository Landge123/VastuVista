export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    status?: number;
    errors?: Array<{ field: string; message: string }>;
}
