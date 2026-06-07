import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  // ========================
  // Private Helper Methods
  // ========================

  private async findBookmarkOrFail(where: { id?: number; userId?: number; packageId?: number }) {
    const bookmark = where.id
      ? await this.prisma.bookmark.findUnique({ where: { id: where.id } })
      : await this.prisma.bookmark.findFirst({ where: { userId: where.userId, packageId: where.packageId } });

    if (!bookmark) {
      throw new NotFoundException('Bookmark tidak ditemukan');
    }

    return bookmark;
  }

  private async deleteBookmark(bookmark: { id: number }) {
    const result = await this.prisma.bookmark.delete({
      where: { id: bookmark.id },
    });

    return {
      success: true,
      message: 'Bookmark berhasil dihapus',
      metadata: { status: HttpStatus.OK },
      data: result,
    };
  }

  // ========================
  // Public Methods
  // ========================

  async create(userId: number, packageId: number) {
    const existing = await this.prisma.bookmark.findFirst({
      where: { userId, packageId },
    });

    if (existing) {
      throw new BadRequestException('Sudah di-bookmark');
    }

    await this.prisma.bookmark.create({
      data: { userId, packageId },
    });

    return {
      success: true,
      message: 'Bookmark berhasil dibuat',
      metadata: { status: HttpStatus.CREATED },
    };
  }

  async findAll(userId: number) {
    const data = await this.prisma.bookmark.findMany({
      where: { userId },
      include: { package: true },
    });

    return {
      success: true,
      message: 'Berhasil mengambil semua bookmark',
      metadata: { status: HttpStatus.OK, count: data.length },
      data,
    };
  }

  async remove(id: number) {
    const bookmark = await this.findBookmarkOrFail({ id });
    return this.deleteBookmark(bookmark);
  }

  async removeByPackage(userId: number, packageId: number) {
    const bookmark = await this.findBookmarkOrFail({ userId, packageId });
    return this.deleteBookmark(bookmark);
  }
}
