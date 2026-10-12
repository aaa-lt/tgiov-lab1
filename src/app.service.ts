import { Injectable } from '@nestjs/common';

const startedAt = new Date();

export interface DeploymentInfo {
  platform: 'render' | 'local';
  service: string | null;
  instance: string | null;
  url: string | null;
  repo: string | null;
  branch: string | null;
  commit: string | null;
  node: string;
  startedAt: string;
  uptimeSeconds: number;
  serverTime: string;
}

@Injectable()
export class AppService {
  getInfo(): DeploymentInfo {
    const env = (name: string) => process.env[name] || null;
    return {
      platform: process.env.RENDER === 'true' ? 'render' : 'local',
      service: env('RENDER_SERVICE_NAME'),
      instance: env('RENDER_INSTANCE_ID'),
      url: env('RENDER_EXTERNAL_URL'),
      repo: env('RENDER_GIT_REPO_SLUG'),
      branch: env('RENDER_GIT_BRANCH'),
      commit: env('RENDER_GIT_COMMIT'),
      node: process.version,
      startedAt: startedAt.toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      serverTime: new Date().toISOString(),
    };
  }
}
