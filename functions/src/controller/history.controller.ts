import { Controller, Get, UseAfter, UseBefore, Req } from 'routing-controllers';
import { Request } from 'express';

import { loggingAfter, authMiddleware } from '../middleware/middleware';
import { HistoryService } from '../service/history.service';

@Controller('/history')
@UseAfter(loggingAfter)
export class HistoryController {
  private HistoryService: HistoryService;

  constructor() {
    this.HistoryService = new HistoryService();
  }

  @UseBefore(authMiddleware)
  @Get('')
  getAll(@Req() req: Request) {
    const { uid } = req.user;

    return this.HistoryService.getAll(uid);
  }
}
