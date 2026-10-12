import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

const RENDER_ENV = {
  RENDER: 'true',
  RENDER_SERVICE_NAME: 'tgiov-lab1',
  RENDER_GIT_REPO_SLUG: 'aaa-lt/tgiov-lab1',
  RENDER_GIT_COMMIT: '0123456789abcdef0123456789abcdef01234567',
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    await app.close();
  });

  it('GET /health', () =>
    request(app.getHttpServer()).get('/health').expect(200, { status: 'ok' }));

  it('GET /api/info outside Render reports a local run', async () => {
    for (const name of Object.keys(RENDER_ENV)) vi.stubEnv(name, '');
    const res = await request(app.getHttpServer()).get('/api/info').expect(200);
    expect(res.body).toMatchObject({ platform: 'local', commit: null, service: null });
    expect(res.body.node).toBe(process.version);
  });

  it('GET /api/info on Render reports the deployed commit', async () => {
    for (const [name, value] of Object.entries(RENDER_ENV)) vi.stubEnv(name, value);
    const res = await request(app.getHttpServer()).get('/api/info').expect(200);
    expect(res.body).toMatchObject({
      platform: 'render',
      service: 'tgiov-lab1',
      commit: RENDER_ENV.RENDER_GIT_COMMIT,
    });
  });

  it('GET / renders HTML with a link to the deployed commit', async () => {
    for (const [name, value] of Object.entries(RENDER_ENV)) vi.stubEnv(name, value);
    const res = await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/);
    expect(res.text).toContain(
      `https://github.com/aaa-lt/tgiov-lab1/commit/${RENDER_ENV.RENDER_GIT_COMMIT}`,
    );
  });
});
