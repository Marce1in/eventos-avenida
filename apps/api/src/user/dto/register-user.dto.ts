import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto{
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(4)
  @MaxLength(1024)
  @IsNotEmpty()
  @IsString()
  passwd: string;
}
