import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { UnauthorizedError } from '@/src/commons/errors/unauthorized.error';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key'];

    if (!apiKeyHeader) {
      throw new UnauthorizedError('Missing API Key');
    }

    // Compare with the environment variable or any config-based secret
    if (apiKeyHeader !== this.configService.get('API_KEY')) {
      throw new UnauthorizedError('Invalid API Key');
    }

    return true; // Key is valid, allow request to proceed
  }
}
