import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonApiResponseDto } from '@/common/dto/commonApiResponse.dto';
// import { ServiceResponse } from '@/common/types/serviceResponse.type';
import { CustomApiError } from '@/common/exceptions/CustomApiError';
import { ApiOperation } from '@nestjs/swagger';
import { ServiceResponse } from '@/common/types/serviceResponse.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  @ApiOperation({
    summary: '핑처리',
    description: '서버가 살아있나 확인',
  })
  getHello(): CommonApiResponseDto<{ version: string; uuid: string }> {
    const result: ServiceResponse<{ version: string; uuid: string }> = this.appService.getVersion();

    if (!result.valid) {
      throw new CustomApiError(result.errorMsg || '버전 정보를 불러올 수 없습니다.');
    }

    return new CommonApiResponseDto<{ version: string; uuid: string }>({
      valid: true,
      data: result.data,
      msg: 'success',
    });
  }
}
