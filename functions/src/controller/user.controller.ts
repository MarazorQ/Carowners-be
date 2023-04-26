import { Body, Controller, Get, Post, UseAfter, Patch, UseBefore, Req } from 'routing-controllers';
import { Request } from 'express';

import { loggingAfter, authMiddleware } from '../middleware/middleware';
import { UserService } from '../service/user.service';
import { CreateUserDto, UpdateUserDto, CheckUserPhoneDto } from '../dtos/user.dto';

@Controller('/users')
@UseAfter(loggingAfter)
export class UserController {
  constructor(private UserService: UserService) {}

  @UseBefore(authMiddleware)
  @Get('/getInfo')
  getOne(@Req() req: Request) {
    const { uid } = req.user;

    return this.UserService.getOne(uid);
  }

  @UseBefore(authMiddleware)
  @Post('/registration')
  create(@Body() payload: CreateUserDto, @Req() req: Request) {
    const { uid } = req.user;

    return this.UserService.create(payload, uid);
  }

  @UseBefore(authMiddleware)
  @Patch('')
  update(@Body() payload: UpdateUserDto, @Req() req: Request) {
    const { uid } = req.user;

    return this.UserService.update(payload, uid);
  }

  @Post('/checkPhone')
  checkUserPhone(@Body() payload: CheckUserPhoneDto) {
    return this.UserService.checkUserPhone(payload);
  }
}
