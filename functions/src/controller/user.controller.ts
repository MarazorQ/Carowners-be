import { Body, Controller, Get, Post, UseAfter, Patch, UseBefore, Req } from 'routing-controllers';
import { Request } from 'express';

import { loggingAfter, authMiddleware } from '../middleware/middleware';
import { UserService } from '../service/user.service';
import { CreateUserDto, UpdateUserDto, CheckUserPhoneDto } from '../dtos/user.dto';

@Controller('/users')
@UseAfter(loggingAfter)
export class UserController {
  private UserService: UserService;

  constructor() {
    this.UserService = new UserService();
  }

  @UseBefore(authMiddleware)
  @Get('/getInfo')
  getOne(@Req() req: Request) {
    return this.UserService.getOne(req);
  }

  @UseBefore(authMiddleware)
  @Post('/registration')
  create(@Body() payload: CreateUserDto, @Req() req: Request) {
    return this.UserService.create(payload, req);
  }

  @UseBefore(authMiddleware)
  @Patch('')
  update(@Body() payload: UpdateUserDto, @Req() req: Request) {
    return this.UserService.update(payload, req);
  }

  @Post('/checkPhone')
  checkUserPhone(@Body() payload: CheckUserPhoneDto) {
    return this.UserService.checkUserPhone(payload);
  }
}
