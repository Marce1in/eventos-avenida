import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto{
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(1024)
  @IsString()
  passwd: string;
}
