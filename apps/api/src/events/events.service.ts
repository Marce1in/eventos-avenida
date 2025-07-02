import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    const isAdmin = user?.isAdmin || false;

    const eventSelectOptions = {
      id: true,
      name: true,
      date: true,
      time: true,
      location: true,
      description: true,
      userId: true,
      _count: {
        select: { EventUser: true },
      },
      EventUser: isAdmin
        ? {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          }
        : {
            where: { userId },
            select: { userId: true },
          },
    };

    const event = await this.prisma.event.findUnique({
      where: { id },
      select: eventSelectOptions,
    });

    if (!event) {
      return null;
    }

    let participants: { id: string; name: string }[] | undefined = undefined;
    let is_assignee = false;

    if (isAdmin) {
      const eventUsers = event.EventUser as { user: { id: string; name: string } }[];
      participants = eventUsers.map((eventUser) => eventUser.user);
    } else {
      const eventUsers = event.EventUser as { userId: string }[];
      is_assignee = eventUsers.length > 0;
    }

    return {
      id: event.id,
      name: event.name,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      is_owner: event.userId === userId,
      total_participants: event._count.EventUser,
      is_admin: isAdmin,
      participants,
      is_assignee,
    };
  }

  async removeParticipant(eventId: string, userIdToRemove: string) {
    try {
      await this.prisma.eventUser.delete({
        where: {
          // A correção está aqui, usando o nome da chave composta
          // que o seu próprio schema Prisma gerou.
          userId_eventId: {
            userId: userIdToRemove,
            eventId: eventId,
          },
        },
      });
      return { message: 'Participante removido com sucesso.' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Inscrição não encontrada. O usuário pode já ter sido removido.');
      }
      throw error;
    }
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

  async remove(id: string, userId: string, isAdmin: boolean) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (event.userId !== userId && !isAdmin) {
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
    });

    return {
      message: "Você agora está participando desse evento!"
    };
  }

  

  async unassign(eventId: string, userId: any) {
    await this.prisma.eventUser.delete({
      where: {
        userId_eventId: {
          userId, eventId
        }
      }
    });

    return {
      message: "Você saiu do evento :("
    };
  }
}
