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
