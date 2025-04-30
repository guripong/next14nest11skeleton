// src/common/dto/commonApiResponse.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CommonApiResponseDto<TSuccess, TFail = undefined> {
  @ApiProperty({ example: true })
  valid: boolean;

  @ApiProperty({ example: '요청이 성공적으로 처리되었습니다.' })
  msg: string;

  @ApiProperty({
    nullable: true,
    description: '성공 또는 실패에 따라 형태가 달라질 수 있음',
  })
  data: TSuccess | TFail | null;

  constructor(params: { valid: boolean; msg: string; data: TSuccess | TFail | null }) {
    this.valid = params.valid;
    this.msg = params.msg;
    this.data = params.data;
  }
}
