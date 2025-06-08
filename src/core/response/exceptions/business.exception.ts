import { HttpException } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    public readonly code: number,
    message: string
  ) {
    super(message, code);
  }
}