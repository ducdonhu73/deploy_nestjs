import { Controller, Get } from '@nestjs/common';
import { Role } from 'constants/roles';
import { Roles } from 'decorators/roles.decorator';
import { HistoryService } from './history.service';

@Controller('histories')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Roles(Role.ADMIN)
  @Get()
  getAllHistories() {
    return this.historyService.getAllHistories();
  }
}
