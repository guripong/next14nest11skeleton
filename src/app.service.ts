import { ServiceResponse } from '@/common/types/serviceResponse.type';
import { Injectable } from '@nestjs/common';
// import { ServiceResponse } from '@/common/types/serviceResponse.type'; // 이 경로는 실제 사용 경로에 맞게 조정하세요

@Injectable()
export class AppService {
  getVersion(): ServiceResponse<{ version: string; uuid: string }> {
    const version = process.env.npm_package_version || 'unknown';
    const uuid = (global as { SERVER_UUID?: string }).SERVER_UUID || 'no-uuid';

    return {
      valid: true,
      data: {
        version,
        uuid,
      },
    };
  }
}
