import { IsBoolean } from "class-validator";

export class TurnAdminDto { 
  @IsBoolean()
  isAdmin: boolean;
}