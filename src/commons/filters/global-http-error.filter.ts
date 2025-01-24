import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { InvariantError } from '@/src/commons/errors/invariant.error';

@Catch()
export class GlobalHttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof InvariantError) {
      status = exception.statusCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      // Extract status and response from the HttpException
      status = exception.getStatus();
      const httpResponse = exception.getResponse();

      // 'response' can be a string or an object depending on how the HttpException was thrown
      if (typeof httpResponse === 'string') {
        message = httpResponse;
      } else if (typeof httpResponse === 'object' && httpResponse !== null) {
        // The 'httpResponse' often contains additional error information
        message = (httpResponse as any).message || JSON.stringify(httpResponse);
      }
    }

    console.error(exception);

    response.status(status).json({
      success: false,
      message,
    });
  }
}
