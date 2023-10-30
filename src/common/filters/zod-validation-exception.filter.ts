import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { Response } from 'express';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.getZodError().issues[0].message,
      error: exception.name,
    });
  }
}
