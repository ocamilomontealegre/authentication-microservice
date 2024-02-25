import {
  Controller,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/user.dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  private readonly logger = new Logger(AuthenticationController.name);

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
}
