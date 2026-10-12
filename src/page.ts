import type { DeploymentInfo } from './app.service.js';

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const formatUptime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h} ч ${m} мин ${seconds % 60} с`;
};

/** HTML-страница «паспорт развёртывания»: данные подставлены на сервере, JS не нужен. */
export function renderPage(info: DeploymentInfo): string {
  const commit =
    info.commit && info.repo
      ? `<a href="https://github.com/${escape(info.repo)}/commit/${escape(info.commit)}"><code>${escape(info.commit.slice(0, 7))}</code></a>`
      : null;

  const rows: [string, string | null][] = [
    ['Платформа', info.platform === 'render' ? 'Render.com' : 'локальный запуск'],
    ['Сервис', info.service && escape(info.service)],
    ['Экземпляр', info.instance && `<code>${escape(info.instance)}</code>`],
    ['Публичный адрес', info.url && `<a href="${escape(info.url)}">${escape(info.url)}</a>`],
    ['Репозиторий', info.repo && `<a href="https://github.com/${escape(info.repo)}">${escape(info.repo)}</a>`],
    ['Ветка', info.branch && escape(info.branch)],
    ['Коммит', commit],
    ['Node.js', escape(info.node)],
    ['Запущен', info.startedAt],
    ['Время работы', formatUptime(info.uptimeSeconds)],
    ['Время сервера', info.serverTime],
  ];

  const body = rows
    .map(([k, v]) => `<tr><th>${k}</th><td>${v ?? '<span class="none">—</span>'}</td></tr>`)
    .join('\n      ');

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Паспорт развёртывания</title>
  <style>
    :root { color-scheme: light dark; --bg: #f6f7f9; --card: #fff; --fg: #1d2330; --muted: #6b7280; --line: #e5e7eb; --ok: #15803d; }
    @media (prefers-color-scheme: dark) { :root { --bg: #11141a; --card: #1a1f27; --fg: #e6e8eb; --muted: #9aa3af; --line: #2a313c; --ok: #4ade80; } }
    body { margin: 0; padding: 32px 16px; background: var(--bg); color: var(--fg); font: 16px/1.5 system-ui, sans-serif; }
    main { max-width: 720px; margin: 0 auto; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 24px; }
    h1 { margin: 0 0 4px; font-size: 24px; }
    p { margin: 0 0 20px; color: var(--muted); }
    .status { color: var(--ok); font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 8px 0; border-top: 1px solid var(--line); vertical-align: top; }
    th { width: 40%; font-weight: 500; color: var(--muted); }
    td { word-break: break-all; }
    a { color: inherit; }
    .none { color: var(--muted); }
  </style>
</head>
<body>
  <main>
    <h1>Паспорт развёртывания</h1>
    <p><span class="status">● работает</span> · NestJS · JSON: <a href="/api/info">/api/info</a> · <a href="/health">/health</a></p>
    <table>
      ${body}
    </table>
  </main>
</body>
</html>
`;
}
