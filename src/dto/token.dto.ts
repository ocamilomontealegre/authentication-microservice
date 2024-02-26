import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  @ApiProperty()
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }
}
