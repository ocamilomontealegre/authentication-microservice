export class JwtDto {
  constructor(public accessToken: string) {}
}

export class RefreshTokenDto {
  constructor(public refreshToken: string) {}
}
