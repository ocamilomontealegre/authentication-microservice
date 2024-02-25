import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';
import { HttpServices } from './httpServices.service';
import { CreateUserDto } from 'src/dto/user.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly httpServices: HttpServices,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // Register the user data in the database
  async register(createUserDto: CreateUserDto): Promise<User | object> {
    const url = this.configService.get<string>('USERS_SERVICE_URL');

    try {
      return await this.httpServices.postData(url, createUserDto);
    } catch (err) {
      throw new Error(`Failed to register the user: ${err.message}`);
    }
  }

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<User | null> {
    
  }

  // Log player in the system
  async login(): Promise<object> {

  }

  // // Log player out the system
  // async logout(): Promise<object> {

  // }

  // // Refresh token
  // async refreshToken(): Promise<object> {

  // }
}
