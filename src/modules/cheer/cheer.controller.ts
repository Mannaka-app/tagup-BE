import { Controller } from '@nestjs/common';
import { CheerService } from './cheer.service';

@Controller('cheer')
export class CheerController {
  constructor(private readonly cheerService: CheerService) {}
}
