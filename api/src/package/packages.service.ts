import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PrismaService } from 'src/prisma.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}


  private async findPackageOrFail(id: number) {
    try {
      const data = await this.prisma.package.findUnique({
        where: { id },
      });

      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Paket tidak ditemukan',
          metadata: { status: HttpStatus.NOT_FOUND },
        });
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: 'Parameter id tidak valid',
        metadata: { status: HttpStatus.BAD_REQUEST },
      });
    }
  }

  // ========================
  // Public Methods
  // ========================

  async create(createPackageDto: CreatePackageDto) {
    await this.prisma.package.create({
      data: {
        name: createPackageDto.name,
        description: createPackageDto.description,
        price: createPackageDto.price,
        location: createPackageDto.location,
        latitude: createPackageDto.latitude,
        longitude: createPackageDto.longitude,
        image: createPackageDto.image,
      },
    });

    return {
      success: true,
      message: 'Paket berhasil dibuat',
      metadata: { status: HttpStatus.CREATED },
    };
  }

  async findAll() {
    const data = await this.prisma.package.findMany();

    return {
      success: true,
      message: 'Berhasil mengambil data paket',
      metadata: { status: HttpStatus.OK, total_data: data.length },
      data,
    };
  }

  async findOne(id: number) {
    const data = await this.findPackageOrFail(id);

    return {
      success: true,
      message: 'Berhasil mengambil data paket',
      metadata: { status: HttpStatus.OK },
      data,
    };
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const existingPackage = await this.findPackageOrFail(id);

    await this.prisma.package.update({
      where: { id },
      data: {
        name: updatePackageDto.name,
        description: updatePackageDto.description,
        price: updatePackageDto.price,
        location: updatePackageDto.location,
        image: updatePackageDto.image,
      },
    });

    return {
      success: true,
      message: 'Paket berhasil diupdate',
      metadata: { status: HttpStatus.OK },
      data: existingPackage,
    };
  }

  async remove(id: number) {
    await this.findPackageOrFail(id);

    await this.prisma.package.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Paket berhasil dihapus',
      metadata: { status: HttpStatus.OK },
    };
  }
}
