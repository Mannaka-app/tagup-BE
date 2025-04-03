import { Module } from '@nestjs/common';
import { CheerService } from './cheer.service';
import { CheerController } from './cheer.controller';

@Module({
  controllers: [CheerController],
  providers: [CheerService],
})
export class CheerModule {}
