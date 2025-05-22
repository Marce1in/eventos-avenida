import { Controller, Get, Post, Body, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { GetOneUserDto } from './dto/get-one-user.dto';
import { ChangePassDto } from './dto/change-pass.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { EditUserDto } from './dto/edit-user.dto';

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

  @Post('change-pass-req')
  passwordReset(@Body() body: { email: string }) {
    return this.userService.changePassReq(body.email);
  }

  @Patch('change-pass')
    changePass(@Body() body: ChangePassDto) {
    return this.userService.changePass(body.otp, body.newPasswd);
  }

  @UseGuards(AuthGuard)
  @Patch('edit-user-info')
  editUserInfo(@Body() editUserDto: EditUserDto, @Req() request: Request) {
    return this.userService.editUserInfo(editUserDto, request["user"].sub);
  }
}
