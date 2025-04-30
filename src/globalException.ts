import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomApiError } from '@/common/exceptions/CustomApiError';
import { CommonApiResponseDto } from '@/common/dto/commonApiResponse.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let responseBody: CommonApiResponseDto<never, null>;

    console.error('🔥 Exception Caught:', exception);

    if (exception instanceof CustomApiError) {
      // ✅ CustomApiError 처리
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse() as {
        msg: string;
        data?: unknown;
      };

      responseBody = new CommonApiResponseDto<never, null>({
        valid: false,
        msg: exceptionResponse.msg ?? 'Custom API Error',
        data: (exceptionResponse.data ?? null) as null, // ✅ 타입 오류 해결
      });
    } else if (exception instanceof HttpException) {
      // ✅ NestJS 기본 HttpException 처리
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message = 'Unknown Error';

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        // 타입을 any 대신 구조분해 가능
        const { message: msg } = exceptionResponse as {
          message?: string | string[];
        };
        message = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Unknown Error');
      }

      responseBody = new CommonApiResponseDto<never, null>({
        valid: false,
        msg: message,
        data: null,
      });
    } else {
      // ✅ 알 수 없는 서버 오류 처리
      status = 500;
      responseBody = new CommonApiResponseDto<never, null>({
        valid: false,
        msg: 'Internal Server Error',
        data: null,
      });
    }

    // ✅ 명확한 에러 로그 출력
    console.error(`❌ [${request.method}] ${request.url} → ${status}:`, responseBody.msg);

    // ✅ 응답 반환
    response.status(status).json(responseBody);
  }
}
