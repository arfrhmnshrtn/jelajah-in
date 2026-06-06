import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) { }

  /**
   * 1. Admin Create Voucher
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  /**
   * 2. Get Available Voucher (Public)
   */
  @Get('available')
  getAvailableVouchers() {
    return this.vouchersService.getAvailableVouchers();
  }

  /**
   * 2. Get All Voucher (Admin Only)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('all')
  getAllVouchers() {
    return this.vouchersService.getAllVouchers();
  }

  /**
   * 3. Get Available Voucher for Logged In User
   */
  @UseGuards(JwtAuthGuard)
  @Get('available-for-me')
  getAvailableVouchersForUser(@Req() req) {
    return this.vouchersService.getAvailableVouchersForUser(req.user.sub);
  }

  /**
   * 4. Admin Get Voucher Usages (History)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id/usages')
  getVoucherUsages(@Param('id') id: string) {
    return this.vouchersService.getVoucherUsages(id);
  }
}
