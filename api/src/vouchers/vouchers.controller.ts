import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) { }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Get('available')
  getAvailableVouchers() {
    return this.vouchersService.getAvailableVouchers();
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('all')
  getAllVouchers() {
    return this.vouchersService.getAllVouchers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteVoucher(@Param('id') id: string) {
    return this.vouchersService.deleteVoucher(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  updateVoucher(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.vouchersService.updateVoucher(id, updateVoucherDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('available-for-me')
  getAvailableVouchersForUser(@Req() req) {
    return this.vouchersService.getAvailableVouchersForUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id/usages')
  getVoucherUsages(@Param('id') id: string) {
    return this.vouchersService.getVoucherUsages(id);
  }
}
