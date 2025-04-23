import { Module } from '@nestjs/common';
import { CheerService } from './cheer.service';
import { CheerGateway } from './cheer.gateway';

@Module({
  providers: [CheerGateway, CheerService],
})
export class CheerModule {}
