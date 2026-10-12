import { Controller, Get, Header } from '@nestjs/common';
import { AppService, type DeploymentInfo } from './app.service.js';
import { renderPage } from './page.js';

/**
 * Три конечные точки: HTML-страница, те же данные в JSON
 * и health check, который опрашивает Render.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  index(): string {
    return renderPage(this.appService.getInfo());
  }

  @Get('api/info')
  info(): DeploymentInfo {
    return this.appService.getInfo();
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
