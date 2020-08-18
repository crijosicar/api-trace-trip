import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { User } from './users/model/user.schema';
import {
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LogInUserDto } from './users/dto/log-in-user.dto';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Get('auth/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The record has been successfully returned.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async getProfile(@Request() req: any): Promise<User> {
    return req.user;
  }

  @Post('auth/login')
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LogInUserDto })
  @ApiOkResponse({
    description: 'The record has been successfully authenticated.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async login(@Request() req: any): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
}
