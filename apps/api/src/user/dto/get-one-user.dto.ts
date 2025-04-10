import { IsUUID } from 'class-validator';

export class GetOneUserDto {
  @IsUUID()
  id: string;
}
