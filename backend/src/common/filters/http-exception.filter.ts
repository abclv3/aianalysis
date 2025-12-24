import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 글로벌 HTTP 예외 필터
 * 모든 에러를 일관된 형식으로 변환하여 클라이언트에 반환
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors: any = null;

        // HttpException인 경우
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object') {
                message = (exceptionResponse as any).message || message;
                errors = (exceptionResponse as any).errors || null;
            } else {
                message = exceptionResponse as string;
            }
        }
        // 일반 에러인 경우
        else if (exception instanceof Error) {
            message = exception.message;
        }

        // 표준화된 에러 응답
        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
            ...(errors && { errors }),
        };

        // 개발 환경에서는 스택 트레이스 로깅
        if (process.env.NODE_ENV === 'development') {
            console.error('❌ Exception caught:', exception);
        }

        response.status(status).json(errorResponse);
    }
}
