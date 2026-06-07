import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

type UserPayload = { sub: number; role: string };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('register/admin')
  registerAdmin(@Body() body: RegisterDto) {
    return this.authService.registerAdmin(body);
  }

  @Post('login/user')
  loginUser(@Body() body: LoginDto) {
    return this.authService.loginUser(body);
  }

  @Post('login/admin')
  loginAdmin(@Body() body: LoginDto) {
    return this.authService.loginAdmin(body);
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @CurrentUser() user: UserPayload,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.authService.update(user.sub, body, user, file);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  updateById(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.authService.update(+id, body, user, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('users')
  getAllUser() {
    return this.authService.getAllUser();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admins')
  getAllAdmin() {
    return this.authService.getAllAdmin();
  }
}
