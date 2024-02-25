import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { ConfigService } from '@nestjs/config';
import { think } from 'cowsay';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3001;

  await app.listen(PORT, (): void =>
    console.log(
      think({
        text: `Server listening on port http://localhost:${PORT}`,
        e: 'oO',
        T: 'U ',
      }),
    ),
  );
}
bootstrap();
