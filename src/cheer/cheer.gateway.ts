import { WebSocketGateway } from '@nestjs/websockets';
import { CheerService } from './cheer.service';

@WebSocketGateway()
export class CheerGateway {
  constructor(private readonly cheerService: CheerService) {}
}
