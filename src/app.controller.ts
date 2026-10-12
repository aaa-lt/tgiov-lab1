import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service.js';
import { renderPage } from './page.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  index(): string {
    return renderPage(this.appService.getInfo());
  }

  @Get('api/info')
  info() {
    return this.appService.getInfo();
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
