import {
  Controller,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/user.dto';
import { AuthenticationUserDto } from '../dto/authentication.dto';
import { JwtDto, RefreshTokenDto } from '../dto/token.dto';

@ApiTags('authenticate')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  private readonly logger = new Logger(AuthenticationController.name);

  // Register the user in the system
  @ApiOperation({ summary: 'Register the user in the database' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User | object> {
    try {
      const result = await this.authService.register(createUserDto);
      this.logger.log(`User registered: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      this.logger.error(`Error creating user: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Log the user in the system
  @ApiOperation({ summary: 'Log the user in the system' })
  @Post('login')
  async login(
    @Body() authenticationUserDto: AuthenticationUserDto,
  ): Promise<{ acessToken: string; refreshToken: string } | object> {
    try {
      const user = await this.authService.validateUser(
        authenticationUserDto.email,
        authenticationUserDto.password,
      );
      const result = await this.authService.login(user[0]);
      this.logger.log(`User logged in the platform: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      this.logger.error(`Error logging the user: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Log out the player from the system
  @ApiOperation({ summary: 'Log the player out of the system' })
  @Post('logout')
  async logout(@Body() jwtDto: JwtDto): Promise<object> {
    try {
      const result = await this.authService.logout(jwtDto.accessToken);
      this.logger.log(`User logged in the platform: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      this.logger.error(`Error logging out the user: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Refresh accessToken for the player
  @ApiOperation({ summary: 'Refresh accessToken' })
  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    try {
      const result = await this.authService.refreshToken(
        refreshTokenDto.refreshToken,
      );
      this.logger.log(
        `Token refreshed successfully: ${JSON.stringify(result)}`,
      );
      return result;
    } catch (err) {
      this.logger.error(`Error refreshing token: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
