import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// Render передаёт порт в PORT и ждёт, что сервер слушает все интерфейсы.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
await bootstrap();
