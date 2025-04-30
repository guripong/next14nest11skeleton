import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonApiResponseDto } from '@/common/dto/commonApiResponse.dto';

// export class CustomApiError extends HttpException {
//   constructor(message: string, status: number = HttpStatus.BAD_REQUEST) {
//     const responseBody = new CommonApiResponseDto({ valid: false, msg: message, data: null });
//     super(responseBody, status);
//   }
// }

export class CustomApiError extends HttpException {
  constructor(
    message: string,
    status: number = HttpStatus.BAD_REQUEST,
    data?: Record<string, any>, // ✅ 추가 데이터 전달 가능
  ) {
    const responseBody = new CommonApiResponseDto({
      valid: false,
      msg: message,
      data: data && Object.keys(data).length > 0 ? data : null, // 데이터가 있으면 포함, 없으면 null
    });

    super(responseBody, status);
  }
}
