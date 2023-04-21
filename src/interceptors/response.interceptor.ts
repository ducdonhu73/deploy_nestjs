import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseFormatter<T> implements NestInterceptor<T, unknown> {
  intercept(_: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    return next.handle().pipe(map((data) => ({ success: true, payload: data })));
  }
}

@Catch(HttpException)
export class ExceptionFormatter implements ExceptionFilter {
  constructor(private httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger('HTTP');

  catch(exception: Error, host: ArgumentsHost): void {
    let statusCode: number, error: object;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        error = { statusCode, message: response };
      } else {
        error = response;
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = { statusCode, message: exception.message };
    }
    this.logger.error(JSON.stringify(error));
    this.httpAdapterHost.httpAdapter.reply(host.switchToHttp().getResponse(), { success: false, error }, statusCode);
  }
}
