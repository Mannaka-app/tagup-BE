import { Module } from '@nestjs/common';
import { CheerService } from './cheer.service';
import { CheerController } from './cheer.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [CheerController],
  providers: [CheerService],
})
export class CheerModule {}
