import{
    IsNotEmpty,
    IsString,
    MaxLength,

} from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(128)
    name: string;

    @IsNotEmpty()
    @IsString()
    date: string;

    @IsNotEmpty()
    @IsString()
    time: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    location: string;

    @IsNotEmpty()
    @MaxLength(512)
    description: string;

}
