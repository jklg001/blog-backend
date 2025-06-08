import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '返回数据', type: Object })
  data: T;

  @ApiProperty({ description: '提示信息', example: '操作成功' })
  msg: string;

  @ApiProperty({ description: '时间戳', example: Date.now() })
  timestamp: number;

  @ApiProperty({ description: '请求ID（可选）', required: false })
  requestId?: string;
}

export class ErrorResponse {
  @ApiProperty({ description: '错误码', example: 500 })
  code: number;

  @ApiProperty({ description: '错误数据', example: null })
  data: null;

  @ApiProperty({ description: '错误信息', example: '系统错误' })
  msg: string;

  @ApiProperty({ description: '时间戳', example: Date.now() })
  timestamp: number;
}

export class PaginatedData<T> {
  @ApiProperty({ description: '数据列表' })
  items: T[];

  @ApiProperty({ description: '总记录数', example: 100 })
  total: number;

  @ApiProperty({ description: '当前页码', example: 1 })
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  limit: number;
}
