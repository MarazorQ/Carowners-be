import { Body, Controller, Get, Post, UseAfter, Patch, UseBefore, Req, Delete, Param } from 'routing-controllers';
import { Request } from 'express';

import { loggingAfter, authMiddleware } from '../middleware/middleware';
import { VehicleService } from '../service/vehicle.service';
import { CreateVehicleDto } from '../dtos/vehicle.dto';

@Controller('/vehicles')
@UseAfter(loggingAfter)
export class VehicleController {
  private VehicleService: VehicleService;

  constructor() {
    this.VehicleService = new VehicleService();
  }

  @UseBefore(authMiddleware)
  @Get('')
  getAll(@Req() req: Request) {
    return this.VehicleService.getAll(req);
  }

  @UseBefore(authMiddleware)
  @Post('')
  create(@Body() payload: CreateVehicleDto, @Req() req: Request) {
    return this.VehicleService.create(payload, req);
  }

  @UseBefore(authMiddleware)
  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: Request) {
    return this.VehicleService.delete(id, req);
  }

  @UseBefore(authMiddleware)
  @Patch('/:id')
  update(@Param('id') id: string, @Body() payload: any, @Req() req: Request) {
    return this.VehicleService.update(id, payload, req);
  }
}
