## Quick orientation

This repository generates a newspaper-style front page by fetching RSS feeds, picking items, composing HTML from templates, and rendering the result to an image with Puppeteer.

Key directories and files
- `src/app.ts` — application entry point; wires services and exposes `GET /` which fetches feeds, builds a `FrontPage`, generates HTML and renders an image.
- `src/services/` — main application logic: `RssService`, `ItemPicker`, `HtmlService`, `ImageService`, `StorageService`, `QrCodeGeneratorService`, `WeatherService`.
- `src/models/` — plain DTO-like classes: `NewsItem`, `FrontPage`, `AdditionalData`, `WeatherData`.
- `src/templates/` — HTML/CSS templates (`NewTemplate.html`, `NewStyle.css`) used by `HtmlService.generateNewHtml`.
- `src/utils/Scheduler.ts` — cron helper (uses `node-cron`) for scheduled tasks.

Big picture & data flow (why)
- Request flow (single-page run): `app.ts` calls `RssService.fetchLatestItems` for several feeds. Each item is converted into a `NewsItem` and given a generated QR <img> string.
- `ItemPicker` selects a `mainStory` and two `subStories`, persists seen titles via `StorageService` (writes to `src/services/seenTitles.json`).
- `HtmlService.generateNewHtml` injects CSS and HTML template placeholders and splits main story content into left/right columns using a simple word-count algorithm. The output HTML is rendered by `ImageService` (Puppeteer) to `src/images/output.png`.

Developer workflows (how to run / test)
- Install: use your normal npm workflow (project uses CommonJS + TypeScript). Example:
  - npm install
- Run locally in dev mode (TypeScript at runtime):
  - npm run dev
    - This runs `nodemon --exec ts-node src/app.ts` per `package.json`.
  - Server listens on port 3000 and the root route generates the page on-demand.
- Tests and coverage:
  - npm test  (runs `jest --detectOpenHandles --forceExit`)
  - npm run coverage  (runs `jest --coverage`)
  - Jest is configured via `jest.config.js` with `ts-jest` and moduleNameMapper for `@models/@services/@utils` aliases.

Project-specific patterns & gotchas
- Module aliases: `_moduleAliases` are declared in `package.json` (`@src`, `@models`, `@services`, `@utils`) and `module-alias/register` is required in `src/app.ts`. When editing imports, prefer the aliases used throughout the codebase.
- Templates are filled by string replacement in `HtmlService`; HTML placeholders use `{{...}}`. Keep template variable names in sync with `HtmlService.generateNewHtml` (e.g. `{{mainStoryTitle}}`, `{{leftContent}}`).
- Persistent state: `StorageService` writes to a relative file path resolved from `__dirname` — `new StorageService('seenTitles.json')` writes into `src/services/seenTitles.json`. Tests or CI may need to stub or mock `StorageService` to avoid file I/O.
- Puppeteer usage: `ImageService.renderHtmlToImage` launches a headless browser. On CI, ensure Chromium is available or provide Puppeteer flags (example: `puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] })`).
- QR codes are generated synchronously as data URLs using the `qrcode` package inside `QrCodeGeneratorService` and returned as `<img>` tags — tests can assert on the presence of `class="qrCode"`.
- HTML splitting logic: `HtmlService` performs paragraph-based splitting using regexes and word counts (functions: `cropAndSplitStory`, `cropContentAtWordCount`). If you modify templates or content markup, verify these functions still split correctly.

Testing notes & helpers
- Unit tests are in `__tests__` and reference code under `src/`. Tests use module aliases configured in `jest.config.js`.
- If a test interacts with file I/O (seenTitles.json) or Puppeteer, prefer mocking those services instead of touching disk or launching browsers in unit tests. The repo includes several service unit tests already under `__tests__/services/`.

Common edits & examples
- To adjust the main-page styling, edit `src/templates/NewStyle.css`. `HtmlService` embeds this CSS into the generated HTML (`{{css}}` placeholder).
- To change feed sources or categories, update `src/app.ts` where `RssService.fetchLatestItems` is called (URLs and category labels).

Troubleshooting quick wins
- If `npm run dev` fails: ensure dependencies installed and `ts-node` is present. For Puppeteer-related crashes, try launching with `args: ['--no-sandbox']` in `ImageService`.
- If Jest fails to resolve imports, verify `jest.config.js` moduleNameMapper matches `package.json` module aliases.

If anything here is inaccurate or you'd like more detail (e.g., examples of mocking StorageService or Puppeteer), tell me which area to expand and I will iterate.
