import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
