import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

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
