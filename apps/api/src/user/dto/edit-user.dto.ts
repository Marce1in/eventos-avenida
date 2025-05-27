import { PartialType } from "@nestjs/mapped-types";
import { RegisterUserDto } from "./register-user.dto";
import { ValidateIf } from "class-validator";

export class EditUserDto extends PartialType(RegisterUserDto) {
  @ValidateIf(o => o.passwd !== "")
  passwd?: string;
}
