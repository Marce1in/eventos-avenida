import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(String(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Req() request: Request) {
    return this.eventsService.update(String(id), updateEventDto, request["user"].sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.eventsService.remove(String(id), request["user"].sub);
  }

  @Get('search/:name')
  searchByName(@Param('name') name: string) {
    return this.eventsService.searchByName(String(name));
  }
}
