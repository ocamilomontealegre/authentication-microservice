import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AuthenticationModule } from './modules/authentication.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { think } from 'cowsay';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  const logger = new Logger('Main');

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3001;

  const options = new DocumentBuilder()
    .setTitle('Authentication Microservice')
    .setDescription('Authentication microservice for the social network app')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  logger.log(`Swagger live on http://localhost:${PORT}/api`);

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
