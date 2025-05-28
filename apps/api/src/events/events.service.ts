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

  async findAll(currentUserId: string, q?: string) {
    const events = await this.prisma.event.findMany({
      where: q ? {
        name: {
          contains: q,
          mode: 'insensitive'
        }
      } : undefined,
      include: {
        EventUser: {
          where: { userId: currentUserId },
          select: { userId: true }
        }
      }
    });

    return events.map(event => ({
      ...event,
      isOwner: event.userId === currentUserId,
      isParticipant: event.EventUser.length > 0
    }));
  }

  async findOne(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        date: true,
        time: true,
        location: true,
        description: true,
        userId: true,
        EventUser: {
          where: { userId },
          select: { userId: true }
        },
        _count: {
          select: { EventUser: true }
        }
      }
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return {
      ...event,
      is_owner: event.userId === userId,
      is_assignee: event.EventUser.length > 0,
      total_participants: event._count.EventUser
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

  async assign(eventId: string, userId: string) {
    await this.prisma.eventUser.create({
      data: {
        eventId: eventId,
        userId: userId
      }
    })

    return {
      message: "Você agora está participando desse evento!"
    }
  }

  async unassign(eventId: string, userId: any) {
    await this.prisma.eventUser.delete({
      where: {
        userId_eventId: {
          userId, eventId
        }
      }
    })

    return {
      message: "Você saiu do evento :("
    }
  }
}
