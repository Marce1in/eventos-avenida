import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePassDto {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  newPasswd: string;
}