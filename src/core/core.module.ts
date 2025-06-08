import { Module } from '@nestjs/common';
import { TransformInterceptor } from './response/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './response/exceptions/http-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    TransformInterceptor,
    HttpExceptionFilter,
  ],
})
export class CoreModule {}
