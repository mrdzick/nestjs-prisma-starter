import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ValidationPipe,
  VersioningType,
  ValidationError,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BadRequestError } from '@/src/commons/errors/bad-request.error';

import { AppModule } from '@/src/app.module';

/**
 * Recursively extracts error messages from ValidationError objects.
 * @param errors Array of ValidationError objects.
 * @param parentPath (Optional) The property path leading to the current errors.
 * @returns An array of error message strings.
 */
function extractErrorMessages(
  errors: ValidationError[],
  parentPath: string = '',
): string[] {
  let messages: string[] = [];

  errors.forEach((error) => {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      const constraints = Object.values(error.constraints);
      messages.push(`${propertyPath}: ${constraints.join(', ')}`);
    }

    if (error.children && error.children.length > 0) {
      messages = messages.concat(
        extractErrorMessages(error.children, propertyPath),
      );
    }
  });

  return messages;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  const ALLOWED_ORIGINS =
    configService.get('ALLOWED_ORIGINS')?.split(',') || [];

  app.enableCors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true); // Origin allowed
      } else {
        callback(new Error('Not allowed by CORS')); // Origin not allowed
      }
    },
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errorMessages = extractErrorMessages(validationErrors);
        const combinedErrorMessage = errorMessages.join('; '); // Use a separator like semicolon for clarity
        return new BadRequestError(combinedErrorMessage);
      },
    }),
  );

  if (configService.get('SWAGGER_ENABLED') === 'true') {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('REST API Documentation')
      .addBearerAuth(
        { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT', in: 'header' },
        'Authorization',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-api-key',
          in: 'header',
        },
        'API-Key',
      )
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  app.enableShutdownHooks();

  const PORT = configService.get('PORT') || 3000;

  await app.listen(PORT ?? 3000);

  return PORT;
}
bootstrap().then(() => console.log(`API was running successfully 🔥`));
