import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { PagesModule } from './pages/pages.module';
import { connectionConfiguration } from './shared/mongosee.config';

const { DATABASE_CONNECTION } = process.env;

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_CONNECTION: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    CacheModule.register(),
    MongooseModule.forRoot(DATABASE_CONNECTION, connectionConfiguration),
    UsersModule,
    PagesModule,
  ],
})
export class AppModule {}
