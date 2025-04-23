import { Module } from '@nestjs/common';
import { CheerService } from './cheer.service';
import { CheerGateway } from './cheer.gateway';
import { CheerController } from './cheer.controller';

@Module({
  providers: [CheerGateway, CheerService],
  controllers: [CheerController],
})
export class CheerModule {}
