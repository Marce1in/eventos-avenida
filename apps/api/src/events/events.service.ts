import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

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

  async findAll(q?: string) {
    return this.prisma.event.findMany({
      where: q
        ? {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        }
        : undefined,
    });
  }

  async findOne(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    };

    return {
      ...event,
      is_owner: event.userId === userId,
    };
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (event.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este evento');
    }

    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }


  async remove(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (event.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para excluir este evento');
    }

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
