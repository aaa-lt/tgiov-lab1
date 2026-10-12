# tgiov-lab1 — Hello, world!

Сервис на NestJS, развёрнутый на Render.com как Web Service. Под приветствием показывает,
где и из какого коммита он запущен: Render передаёт эти сведения в переменных `RENDER_*`.

| Метод и путь | Ответ |
|---|---|
| `GET /` | HTML-страница с данными развёртывания |
| `GET /api/info` | те же данные в JSON |
| `GET /health` | `{"status":"ok"}`, Health Check Path на Render |

## Запуск

Нужны Node.js 22 и Yarn 4 (`corepack enable`).

```bash
yarn install
yarn test          # e2e-тесты трёх эндпоинтов
yarn build         # TypeScript → dist/
node dist/main     # http://localhost:3000, порт берётся из PORT
```

## Render

| Поле | Значение |
|---|---|
| Runtime | Node |
| Build Command | `corepack enable && yarn install --immutable && yarn build` |
| Start Command | `node dist/main` |
| Health Check Path | `/health` |

Версия Node задана полем `engines` в `package.json`, версия Yarn — полем `packageManager`.
