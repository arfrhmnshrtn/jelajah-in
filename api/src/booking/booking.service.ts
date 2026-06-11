import {
  Injectable,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from '../prisma.service';
import { MidtransService } from '../midtrans/midtrans.service';
import { nanoid } from 'nanoid';
import { VoucherHelper } from '../vouchers/helpers/voucher.helper';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly midtransService: MidtransService,
  ) {}


  private async findBookingOrFail(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    return booking;
  }

  private buildListResponse(message: string, data: any[]) {
    return {
      success: true,
      message,
      metadata: { status: HttpStatus.OK, count: data.length },
      data,
    };
  }


  async create(userId: number, createBookingDto: CreateBookingDto) {
    const { packageId, quantity, date, voucherCode } = createBookingDto;

    // Gunakan Prisma transaction untuk atomic operation (Booking + Voucher Usage)
    return this.prisma.$transaction(async (tx) => {
      // 1. Ambil data package
      const paket = await tx.package.findUnique({
        where: { id: packageId },
      });

      if (!paket) {
        throw new NotFoundException('Paket tidak ditemukan');
      }

      // 2. Hitung harga awal
      const originalPrice = paket.price * quantity;
      let finalPrice = originalPrice;
      let discountAmount = 0;
      let appliedVoucherId: string | null = null;

      // 3. Proses voucher jika user memasukkan voucherCode
      if (voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: voucherCode },
        });

        if (!voucher) {
          throw new NotFoundException('Voucher tidak ditemukan');
        }

        const userUsages = await tx.voucherUsage.findMany({
          where: { voucherId: voucher.id, userId },
        });

        // Validasi ketersediaan voucher
        VoucherHelper.validateVoucherAvailability(voucher, userUsages, originalPrice);

        // Hitung diskon
        discountAmount = VoucherHelper.calculateDiscount(voucher, originalPrice);
        finalPrice = Math.max(originalPrice - discountAmount, 0);

        appliedVoucherId = voucher.id;

        // Tambah counter pemakaian voucher
        await tx.voucher.update({
          where: { id: voucher.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      // 4. Generate booking code
      const bookingCode = `TRX-${nanoid(4).toUpperCase()}`;

      // 5. Simpan booking ke database dengan harga final
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          userId,
          packageId,
          date: new Date(date),
          quantity,
          totalPrice: finalPrice,
          status: 'PENDING',
        },
      });

      // 6. Jika pakai voucher, simpan riwayat penggunaan (VoucherUsage)
      if (appliedVoucherId) {
        await tx.voucherUsage.create({
          data: {
            voucherId: appliedVoucherId,
            userId,
            bookingId: booking.id,
          },
        });
      }

      // 7. Panggil Midtrans dengan finalPrice
      const transaction: { token: string; redirect_url: string } =
        await this.midtransService.createTransaction(
          `ORDER-${booking.id}`,
          finalPrice,
          paket.name,
        );

      return {
        success: true,
        message: voucherCode ? 'Booking berhasil dibuat dengan voucher' : 'Booking berhasil dibuat',
        data: booking,
        discount: discountAmount,
        snapToken: transaction.token,
        redirectUrl: transaction.redirect_url,
      };
    });
  }

  async findAll() {
    const data = await this.prisma.booking.findMany();
    return this.buildListResponse('Data booking berhasil ditemukan', data);
  }

  async findByUser(userId: number) {
    const data = await this.prisma.booking.findMany({
      where: { userId },
      include: { package: true },
    });
    return this.buildListResponse('Berhasil mengambil riwayat booking', data);
  }

  async cancel(id: number, user: { sub: number; role: string }) {
    const booking = await this.findBookingOrFail(id);

    if (booking.userId !== user.sub && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda tidak berhak menghapus booking ini');
    }

    if (booking.status === 'CANCELED') {
      throw new BadRequestException('Booking sudah dibatalkan!');
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Booking tidak bisa dibatalkan!');
    }

    await this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELED' },
    });

    return {
      success: true,
      message: 'Booking berhasil dibatalkan',
      data: booking,
    };
  }
}
