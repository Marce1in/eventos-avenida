import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto{
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  name: string;

  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(1024)
  @IsString()
  passwd: string;
}
