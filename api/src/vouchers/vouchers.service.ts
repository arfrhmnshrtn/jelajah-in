import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VoucherHelper } from './helpers/voucher.helper';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) { }

  /**
   * 1. Admin Create Voucher
   */
  async create(createVoucherDto: CreateVoucherDto) {
    const { code, discountValue, maxDiscount, minPurchase, ...rest } =
      createVoucherDto;

    const existingVoucher = await this.prisma.voucher.findUnique({
      where: { code },
    });

    if (existingVoucher) {
      throw new ConflictException('Voucher code already exists');
    }

    const voucher = await this.prisma.voucher.create({
      data: {
        code,
        discountValue: new Prisma.Decimal(discountValue),
        maxDiscount:
          maxDiscount !== undefined ? new Prisma.Decimal(maxDiscount) : null,
        minPurchase:
          minPurchase !== undefined ? new Prisma.Decimal(minPurchase) : null,
        ...rest,
      },
    });

    return {
      success: true,
      message: 'Voucher berhasil dibuat',
      data: voucher,
    };
  }

  /**
   * 2. Get Available Voucher
   */
  async getAvailableVouchers() {
    const now = new Date();

    const vouchers = await this.prisma.voucher.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
    });

    const availableVouchers = vouchers.filter((v) => v.quota > v.usedCount);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Berhasil mendapatkan voucher yang tersedia',
      metadata: { count: availableVouchers.length },
      data: availableVouchers,
    };
  }

  /**
   * 2. Get All Voucher (Admin Only)
   */
  async getAllVouchers() {
    const vouchers = await this.prisma.voucher.findMany();

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Berhasil mendapatkan semua voucher',
      metadata: { count: vouchers.length },
      data: vouchers,
    };
  }

  async deleteVoucher(id: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher tidak ditemukan');
    }

    if (voucher.usedCount > 0) {
      throw new BadRequestException('Voucher tidak dapat dihapus karena sudah di gunakan!!');
    }

    await this.prisma.voucher.delete({
      where: { id },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Voucher berhasil dihapus',
    };
  }

  /**
   * 4. Admin Update Voucher
   */
  async updateVoucher(id: string, updateVoucherDto: UpdateVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher tidak ditemukan');
    }

    const { code, discountValue, maxDiscount, minPurchase, ...rest } =
      updateVoucherDto;

    // If code is being changed, check for conflicts
    if (code && code !== voucher.code) {
      const existingVoucher = await this.prisma.voucher.findUnique({
        where: { code },
      });

      if (existingVoucher) {
        throw new ConflictException(
          'Voucher code sudah digunakan oleh voucher lain',
        );
      }
    }

    const updatedVoucher = await this.prisma.voucher.update({
      where: { id },
      data: {
        ...(code !== undefined && { code }),
        ...(discountValue !== undefined && {
          discountValue: new Prisma.Decimal(discountValue),
        }),
        ...(maxDiscount !== undefined && {
          maxDiscount: new Prisma.Decimal(maxDiscount),
        }),
        ...(minPurchase !== undefined && {
          minPurchase: new Prisma.Decimal(minPurchase),
        }),
        ...rest,
      },
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Voucher berhasil diperbarui',
      data: updatedVoucher,
    };
  }

  /**
   * 3. Get Available Voucher for Logged In User
   */
  async getAvailableVouchersForUser(userId: number) {
    const now = new Date();

    const vouchers = await this.prisma.voucher.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        voucherUsages: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    const availableVouchers = vouchers
      .filter((v) => v.quota > v.usedCount)
      .filter((v) => v.voucherUsages.length < v.userLimit)
      .map((v) => {
        const { voucherUsages, ...rest } = v;
        return rest;
      });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Berhasil mendapatkan voucher yang tersedia untuk Anda',
      metadata: { count: availableVouchers.length },
      data: availableVouchers,
    };
  }

  /**
   * 3. Admin Get Voucher Usages (History)
   */
  async getVoucherUsages(id: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher tidak ditemukan');
    }

    const usages = await this.prisma.voucherUsage.findMany({
      where: { voucherId: id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        booking: {
          select: {
            bookingCode: true,
            package: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        usedAt: 'desc',
      },
    });

    const mappedData = usages.map((usage) => ({
      id: usage.id,
      usedAt: usage.usedAt,
      user: {
        name: usage.user.name,
        email: usage.user.email,
      },
      booking: {
        bookingCode: usage.booking.bookingCode,
        packageName: usage.booking.package.name,
      },
    }));

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Berhasil mendapatkan riwayat penggunaan voucher',
      metadata: { count: mappedData.length },
      data: mappedData,
    };
  }
}
