import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RateLimiterService } from 'src/rate-limiter/rate-limiter.service';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  constructor(private rateLimiterService: RateLimiterService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const isRateLimited = await this.rateLimiterService.isRateLimited(
      request.ip,
      request.url,
      5,
      60,
    );

    if (isRateLimited) {
      throw new HttpException(
        'Rate limit exceeded. Please try again later',
        HttpStatus.BAD_REQUEST,
      );
    }

    return next.handle();
  }
}
