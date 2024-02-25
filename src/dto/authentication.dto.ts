import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class AuthenticationUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
