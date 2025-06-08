import { 
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse } from '../dto/response.dto';
import { Request } from 'express';

// 在文件顶部添加类型扩展声明
declare module 'express' {
  interface Request {
    id?: string;
  }
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    
    return next.handle().pipe(
      map(data => ({
        code: 200,
        data: data?.items ? this.wrapPaginated(data) : data,
        msg: 'success',
        timestamp: Date.now(),
        requestId: request.id || crypto.randomUUID()
      }))
    );
  }

  private wrapPaginated(data: any) {
    return {
      items: data.items,
      total: data.total,
      page: data.page,
      limit: data.limit
    };
  }
}