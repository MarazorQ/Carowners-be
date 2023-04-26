import { Controller, Get, UseAfter, UseBefore, Req } from 'routing-controllers';
import { Request } from 'express';

import { loggingAfter, authMiddleware } from '../middleware/middleware';
import { HistoryService } from '../service/history.service';

@Controller('/history')
@UseAfter(loggingAfter)
export class HistoryController {
  constructor(private HistoryService: HistoryService) {}

  @UseBefore(authMiddleware)
  @Get('')
  getAll(@Req() req: Request) {
    const { uid } = req.user;

    return this.HistoryService.getAll(uid);
  }
}
