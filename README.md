# NestJS Prisma Starter

A boilerplate to quickly start new NestJS projects with Prisma, JWT & API key authentication, global error handling, Swagger documentation, and much more. This starter helps you avoid repetitive setup steps so you can focus on building features right away.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)

  - [Installation](#installation)
  - [Setup Environment Variables](#setup-environment-variables)
  - [Database Setup](#database-setup)

- [Project Structure](#project-structure)
- [Authentication and Security](#authentication--security)

  - [JWT Guard and API Key Guard](#jwt-guard-and-api-key-guard)
  - [Custom Decorator](#custom-decorator)

- [Error Handling](#error-handling)
- [DTOs and Validation](#dtos-and-validation)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Versioning](#versioning)
- [Shutdown Hooks](#shutdown-hooks)
- [Contribution](#contribution)

## Features

1. **NestJS + Prisma**

   A robust integration of [NestJS](https://nestjs.com) with [Prisma](https://prisma.io) ORM for database interactions.

2. **JWT & API Key Authentication**

   - Custom Guards for verifying JWT tokens and API keys.
   - A reusable Decorator to extract user information from the JWT token.

3. **Global Prefix**

   All routes are prefixed with /api by default.

4. **CORS Enabled**

   Configurable CORS settings for secure cross-origin requests.

5. **Exception Handling**

   - Global HTTP exception filter for consistent error responses.
   - Custom error classes for more granular error handling.

6. **API Documentation**

   Integrated Swagger module for comprehensive API docs.

7. **API Endpoint Versioning**

   Example setup for versioned API endpoints (e.g., v1, v2).

8. **DTOs for Responses**

   - Generic pagination DTO for paginated responses.
   - Non-paginated DTO examples for consistent response structures.

9. **Graceful Shutdown Hooks**

   Automatic closing of Prisma connections on NestJS shutdown.

## Prerequisites

- **Node.js** (>= 20.18.x)
- **npm** or **yarn**
- A running **PostgreSQL**, **MySQL**, **SQLite**, or any other [Prisma-supported database](https://www.prisma.io/docs/orm/reference/supported-databases).

## Getting Started

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/mrdzick/nestjs-prisma-starter.git
   cd nestjs-prisma-starter
   ```
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Setup Environment Variables

Create a `.env` file in the root directory and add your environment-specific variables. You can see [env.sample](.env.sample) file.

### Database Setup

This starter includes a minimal Prisma schema (`prisma/schema.prisma`) that defines only the `generator` and `datasource` blocks:

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Because no models are predefined, you’ll need to add your own [Prisma models](https://www.prisma.io/docs/orm/prisma-schema/data-model/models) as needed. Once you have updated your schema, you can create or migrate your database structure:

1. Validate Prisma schema:
   ```
   npx prisma validate
   ```
2. Push schema to your database:
   ```
   npx prisma db push
   ```
   or run migrations if you plan to track changes over time:
   ```
   npx prisma migrate dev
   ```

### Running the Application

To start the development server, run:

```
npm run start:dev
```

NestJS will start in watch mode.

## Project Structure

```
nestjs-prisma-starter
├── src
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root module
│   ├── app.controller.ts      # Example controller
│   ├── app.service.ts         # Example service
│   ├── prisma
│   │   ├── prisma.module.ts   # Exports PrismaService
│   │   └── prisma.service.ts  # Handles DB connection (onModuleInit and onModuleDestroy)
│   ├── commons
│   │   ├── decorators
│   │   │   ├── get-user.decorator.ts     # Custom decorator for extracting user data from request (e.g., JWT payload)
│   │   ├── dtos
│   │   │   ├── get-all-response.dto.ts   # Defines a standard response schema for fetching resources
│   │   │   └── pagination-request.dto.ts # DTO for incoming requests that include pagination parameters
│   │   ├── errors
│   │   │   ├── bad-request.error.ts      # Custom error representing a generic bad request
│   │   │   ├── forbidden.error.ts        # Custom error thrown when access is forbidden
│   │   │   ├── invariant.error.ts        # Custom error for failed assumptions or invariants
│   │   │   ├── not-found.error.ts        # Custom error for resources not found
│   │   │   └── unauthorized.error.ts     # Custom error when user is not authorized
│   │   ├── filters
│   │   │   └── global-http-error.filter.ts # HTTP exception filter for global error handling
│   │   ├── guards
│   │   │   ├── api-key.guard.ts  # Guard that checks for a valid API key in the request
│   │   │   └── jwt-auth.guard.ts # Guard that validates JWT tokens in incoming requests
│   │   └── strategies
│   │   │   └── jwt.strategy.ts   # JWT-based Passport strategy for authentication
├── prisma
│   └── schema.prisma         # Minimal Prisma schema
├── test
│   ├── app.e2e-spec.ts       # End-to-end test specification
│   └── jest-e2e.json         # Jest configuration file for E2E tests
├── .env.sample               # Example environment variables file
├── .eslintrc.js              # ESLint configuration for linting standards
├── .gitignore                # Specifies files/directories to exclude from version control
├── .prettierrc               # Configuration for Prettier code formatter
├── nest-cli.json             # Configuration file for Nest CLI
├── package.json              # Lists dependencies, scripts, and metadata for this Node project
├── package-lock.json         # Automatically generated lockfile to track exact dependency versions
├── tsconfig.json             # Base TypeScript configuration for the project
├── tsconfig.build.json       # Alternate TypeScript config for building production output
└── README.md                 # Project documentation and overview
```

## Authentication & Security

### JWT Guard and API Key Guard

- **JWT Guard**: Validates the presence and validity of a JWT token in incoming requests.
- **API Key Guard**: Validates a custom header or query parameter containing an API key.

Example usage in a controller:

```
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/src/auth/guards/jwt-auth.guard';
import { ApiKeyAuthGuard } from '@/src/auth/guards/api-key-auth.guard';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile() {
    // ...
  }

  @UseGuards(ApiKeyAuthGuard)
  @Get('data')
  getData() {
    // ...
  }
}
```

### Custom Decorator

A custom decorator (e.g., `@GetUser()`) allows you to extract user information from the JWT token payload:

```
// usage in a controller
@Get('me')
@UseGuards(JwtAuthGuard)
getMe(@GetUser() user: any) {
  return user;
}
```

## Error Handling

A **global error filter** is set up to handle HTTP exceptions uniformly throughout the application. It is registered in `AppModule` using the `APP_FILTER` token:

```
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';

import { AppService } from '@/src/app.service';
import { AppController } from '@/src/app.controller';

import { GlobalHttpErrorFilter } from '@/src/commons/filters/global-http-error.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalHttpErrorFilter,
    },
  ],
})
export class AppModule {}
```

When an error is thrown anywhere in the application, the global filter ensures a consistent error response structure.

## DTOs and Validation

- **Pagination DTO**: Simplifies the handling of paginated requests and responses (e.g. `limit`, `page`, `length`, `current_page`, `total_page`).
- **Response DTO**: Ensures consistent response schemas across the application.

Using [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer), you can validate incoming requests and transform data automatically.

```
import { IsInt, IsString, IsEmail, IsOptional } from 'class-validator';

export class ExampleDto {
  @IsString()
  name: string;

  @IsEmail()
  email: email;

  @IsOptional()
  @IsInt()
  age?: number;
}
```

## API Documentation (Swagger)

Swagger is enabled by setting up the `SWAGGER_ENABLED=true` on environment variables. After starting the application, visit:

```
http://localhost:3000/api-docs # Depends on your swagger configuration
```

You can customize Swagger options in `main.ts`:

```
// Other code
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
// Other code
```

## Versioning

The application demonstrates how to version your routes:

```
@Controller({ path: 'example', version: '1' })
export class ExampleV1Controller { /* ... */ }

@Controller({ path: 'example', version: '2' })
export class ExampleV2Controller { /* ... */ }
```

In `main.ts`:

```
app.enableVersioning({
   type: VersioningType.URI,
   defaultVersion: '1',
});
```

This creates versioned endpoints like `/api/v1/example` and `/api/v2/example`.

## Shutdown Hooks

Prisma’s `onModuleInit()` and `onModuleDestroy()` methods are used for connecting and disconnecting the database client, ensuring a clean shutdown of the application.

```
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: PrismaService.constructDatabaseUrl(configService),
        },
      },
    });
  }

  private static constructDatabaseUrl(configService: ConfigService): string {
    const user = configService.get<string>('SQLDB_USERNAME');
    const password = configService.get<string>('SQLDB_PASSWORD');
    const host = configService.get<string>('SQLDB_HOST');
    const port = configService.get<number>('SQLDB_PORT');
    const database = configService.get<string>('SQLDB_DATABASE');
    const schema = configService.get<string>('SQLDB_SCHEMA')
      ? `?schema=${configService.get<string>('SQLDB_SCHEMA')}`
      : '';

    return `postgresql://${user}:${password}@${host}:${port}/${database}${schema}`;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Additionally, to enable shutdown hooks when user press `ctrl + z `button, this line was added on `main.ts` file:

```
app.enableShutdownHooks();
```

## Contribution

If you have any feature requests or want to fix a bug, feel free to open an issue or submit a pull request. Contributions are welcome and greatly appreciated!

## Thank You!

Thank you for using the **NestJS Prisma Starter**! We hope it saves you time and effort in setting up your next NestJS application. If you have any questions or feedback, please open an issue or reach out to the maintainers. Happy coding!
