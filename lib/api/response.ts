import { NextRequest, NextResponse } from 'next/server';
import { APIError } from './errors';
import dbConnect from '../mongodb';

interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

export class ApiResponse {
  static success<T>(
    data: T,
    message?: string,
    statusCode: number = 200
  ): NextResponse<SuccessResponse<T>> {
    const response: SuccessResponse<T> = {
      success: true,
      data,
      message,
    };

    return NextResponse.json(response, { status: statusCode });
  }

  static error(
    error: string | APIError | Error,
    statusCode: number = 500
  ): NextResponse<ErrorResponse> {
    const message = error instanceof Error ? error.message : error;
    const status = error instanceof APIError ? error.statusCode : statusCode;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}

export function asyncHandler<T = unknown>(
  handler: (req: NextRequest, context?: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: T): Promise<NextResponse> => {
    try {
      // Ensure MongoDB is connected
      await dbConnect();

      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);
      return ApiResponse.error(error instanceof Error ? error : new Error('Unknown error'));
    }
  };
}

export const apiResponse = ApiResponse;
export type { SuccessResponse, ErrorResponse };
