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

  // Store invalid tokens
  private readonly tokenBlacklist: Set<string> = new Set();

  // Store refresh tokens
  private readonly refreshTokens: Set<string> = new Set();

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
    const url = this.configService.get<string>('USERS_SERVICE_URL');

    try {
      const user = (await this.httpServices.getData(`${url}/${email}`)) as User;
      const paswordValidation = await compare(password, user[0].password);
      if (user && paswordValidation) {
        return user;
      }
      return null;
    } catch (err) {
      throw new Error(`Failed to validate the user data: ${err.message}`);
    }
  }

  // Log player in the system
  async login(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = { email: user.email, sub: user._id };
      return {
        accessToken: this.generateAccessToken(payload),
        refreshToken: this.generateRefreshToken(user._id),
      };
    } catch (err) {
      throw new Error(`Failed to log the user in: ${err.message}`);
    }
  }

  // Log player out the system
  async logout(token: string): Promise<object> {
    try {
      if (this.tokenBlacklist.has(token)) {
        throw new Error('Token has already been invalidated');
      }

      this.tokenBlacklist.add(token);
      return { message: 'User logged out successfully' };
    } catch (err) {
      throw new Error(`Failed to log the user out: ${err.message}`);
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const userId = this.verifyRefreshToken(refreshToken);

      const accessToken = this.generateAccessToken({ email: '', sub: userId });

      return {
        accessToken,
      };
    } catch (err) {
      throw new Error(`Failed to refresh token: ${err.message}`);
    }
  }

  // Generate a JWT as the accessToken
  private generateAccessToken(payload: { email: string; sub: string }): string {
    return this.jwtService.sign(payload);
  }

  // Generate a random string for refresh token
  private generateRefreshToken(userId: string): string {
    const refreshToken = `${Math.random().toString(36).substring(2)}${userId}`;
    this.refreshTokens.add(refreshToken);
    return refreshToken;
  }

  // Verify refreshToken
  private verifyRefreshToken(refreshToken: string): string {
    const storedToken = [...this.refreshTokens].find(
      (token) => token === refreshToken,
    );
    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    // For simplicity, we assume the token is valid and return the user ID
    return storedToken.substring(13);
  }
}
