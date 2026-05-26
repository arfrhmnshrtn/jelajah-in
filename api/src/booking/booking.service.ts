import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { MidtransService } from '../midtrans/midtrans.service';
import { metadata } from 'reflect-metadata/no-conflict';
import { nanoid } from 'nanoid';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private midtransService: MidtransService,
  ) {}

  async create(
    userId: number,
    // name: string,
    // email: string,
    createBookingDto: CreateBookingDto,
  ) {
    // ambil data package
    const paket = await this.prisma.package.findUnique({
      where: { id: createBookingDto.packageId },
    });

    if (!paket) {
      throw new NotFoundException('Paket tidak ditemukan');
    }

    // hitung total harga
    const totalPrice = paket.price * createBookingDto.quantity;

    const bookingCode = `TRX-${nanoid(4).toUpperCase()}`;

    // simpan booking
    const booking = await this.prisma.booking.create({
      data: {
        bookingCode: bookingCode,
        userId: userId,
        packageId: createBookingDto.packageId,
        date: new Date(createBookingDto.date),
        quantity: createBookingDto.quantity,
        totalPrice,
        status: 'PENDING',
      },
    });

    // PANGGIL MIDTRANS
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const transaction: { token: string; redirect_url: string } =
      await this.midtransService.createTransaction(
        `ORDER-${booking.id}`,
        totalPrice,
        paket.name,
      );

    return {
      success: true,
      message: 'Booking berhasil dibuat',
      data: booking,
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  }
}
