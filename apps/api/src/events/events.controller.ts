import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ForbiddenException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() request: Request) {
    return this.eventsService.create(createEventDto, request["user"].sub);
  }

  @Get()
  findAll(@Req() request: Request, @Query('q') q?: string) {
    return this.eventsService.findAll(request["user"].sub ,q);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.eventsService.findOne(String(id), request["user"].sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Req() request: Request) {
    return this.eventsService.update(String(id), updateEventDto, request["user"].sub);
  }
  
  @UseGuards(AuthGuard)
  @Get(':id/stats')
  async getEventStats(@Param('id') eventId: string, @Req() req) {
    if (!req.user.isAdmin) {
      throw new ForbiddenException('Apenas administradores podem ver as estatísticas.');
    }
    return this.eventsService.getEventStats(eventId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() request: Request) {
  return this.eventsService.remove(
    String(id), 
    request["user"].sub, 
    request["user"].isAdmin
  );
}
  @Delete(':eventId/participants/:userId')
  async removeParticipant(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {

    if (!req.user.isAdmin) {
      throw new ForbiddenException('Apenas administradores podem remover participantes.');
    }

    return this.eventsService.removeParticipant(eventId, userId);
  }

  @Post('assign/:id')
  assign(@Param('id') id: string, @Req() request: Request) {
    return this.eventsService.assign(id, request["user"].sub)
  }

  @Delete('assign/:id')
  unassign(@Param('id') id: string, @Req() request: Request) {
    return this.eventsService.unassign(id, request["user"].sub)
  }
}
