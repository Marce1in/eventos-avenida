import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(createEventDto: CreateEventDto, userId: string) {
    await this.prisma.event.create({
      data: {
        name: createEventDto.name,
        description: createEventDto.description,
        location: createEventDto.location,
        date: createEventDto.date,
        time: createEventDto.time,
        userId: userId,
      }
    });

    return { message: "Evento criado com sucesso!" };
  }

  async findAll() {
    return this.prisma.event.findMany();
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: { id }
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({
      where: { id }
    });
  }
}