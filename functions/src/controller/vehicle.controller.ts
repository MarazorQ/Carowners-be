import { Body, Controller, Get, Post, UseAfter, Patch, UseBefore, Req, Delete, Param } from 'routing-controllers';
import { Request } from 'express';

import { loggingAfter, authMiddleware } from '../middleware/middleware';
import { VehicleService } from '../service/vehicle.service';
import { CreateVehicleDto } from '../dtos/vehicle.dto';

@Controller('/vehicles')
@UseBefore(authMiddleware)
@UseAfter(loggingAfter)
export class VehicleController {
  constructor(private VehicleService: VehicleService) {}

  @Get('')
  getAll(@Req() req: Request) {
    const { uid } = req.user;

    return this.VehicleService.getAll(uid);
  }

  @Post('')
  create(@Body() payload: CreateVehicleDto, @Req() req: Request) {
    const { uid } = req.user;

    return this.VehicleService.create(payload, uid);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Req() req: Request) {
    const { uid } = req.user;

    return this.VehicleService.delete(id, uid);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() payload: Partial<CreateVehicleDto>, @Req() req: Request) {
    const { uid } = req.user;

    return this.VehicleService.update(id, payload, uid);
  }
}
