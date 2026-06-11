import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly userSelectFields = {
    id: true,
    avatar: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
  };


  private async getAllByRole(role: 'USER' | 'ADMIN') {
    const data = await this.prisma.user.findMany({
      where: { role },
      select: this.userSelectFields,
    });

    const label = role.toLowerCase();

    return {
      success: true,
      message: `Get all ${label} berhasil`,
      metadata: { status: HttpStatus.OK, count: data.length },
      data,
    };
  }

  private async login(data: LoginDto, expectedRole: 'USER' | 'ADMIN') {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }

    if (user.role !== expectedRole) {
      throw new ForbiddenException(`Hanya ${expectedRole} yang dapat login!!`);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Login berhasil',
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  private async createUser(data: RegisterDto, role: 'USER' | 'ADMIN' = 'USER') {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: { name: data.name, email: data.email, password: hashedPassword, role },
    });

    return {
      success: true,
      message: 'Register berhasil',
      metadata: { status_code: HttpStatus.CREATED },
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  private saveAvatar(file: Express.Multer.File): string {
    const uploadDir = path.join(__dirname, '..', '..', 'avatar');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

    return `/avatar/${fileName}`;
  }


  async getAllUser() {
    return this.getAllByRole('USER');
  }

  async getAllAdmin() {
    return this.getAllByRole('ADMIN');
  }

  async register(data: RegisterDto) {
    return this.createUser(data, 'USER');
  }

  async registerAdmin(data: RegisterDto) {
    return this.createUser(data, 'ADMIN');
  }

  async loginUser(data: LoginDto) {
    return this.login(data, 'USER');
  }

  async loginAdmin(data: LoginDto) {
    return this.login(data, 'ADMIN');
  }

  logout() {
    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Logout berhasil',
    };
  }

  async update(
    userId: number,
    data: UpdateUserDto,
    userPayload: { sub: number; role: string },
    file?: Express.Multer.File,
  ) {
    if (userId !== userPayload.sub && userPayload.role !== 'ADMIN') {
      throw new ForbiddenException('Akses ditolak!!');
    }

    const updateData: Record<string, any> = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    if (file) updateData.avatar = this.saveAvatar(file);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: this.userSelectFields,
    });

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Update user berhasil',
      data: updatedUser,
    };
  }
}
