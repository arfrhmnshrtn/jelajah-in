import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(req.user.sub, createBookingDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMyBookings(@Req() req) {
    return this.bookingService.findByUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  cancel(@Param('id') id: string, @Req() req) {
    return this.bookingService.cancel(+id, req.user);
  }
}
