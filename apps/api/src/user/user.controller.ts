import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { GetOneUserDto } from './dto/get-one-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post('register/:otp')
  confirmMail(@Param('otp') otp: string) {
    return this.userService.confirmMail(otp);
  }

  @Get(':id')
  findOne(@Param() getOneUserDto: GetOneUserDto) {
    return this.userService.findOne(getOneUserDto.id);
  }
}
