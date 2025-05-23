import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { GameModule } from './modules/games/games.module';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';
import { FeedsModule } from './modules/feeds/feeds.module';
import { ChatModule } from './modules/chat/chat.module';
import { CheerModule } from './modules/cheer/cheer.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    RedisModule,
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    UsersModule,
    GameModule,
    S3Module,
    FeedsModule,
    ChatModule,
    CheerModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, S3Service],
})
export class AppModule {}
