// Сборка скриптов навыка из src/ в ds-review/scripts/.
// Исходники читаемые и с комментариями, в навык идут сжатые версии: Figma принимает в use_figma до 50 000 символов,
// а модели надёжнее передают короткий код целиком.
// Запуск: node tools/build.mjs  (или npm run build). С флагом --check только проверяет, что собранное совпадает с src/.
import fs from 'node:fs';
import { minify } from 'terser';

const SRC = 'src', OUT = 'ds-review/scripts';
const read = (f) => fs.readFileSync(`${SRC}/${f}`, 'utf8');
// Делит исходник на блок настроек (// @config … // @end-config) и тело
function split(src) {
  const a = src.indexOf('// @config'), b = src.indexOf('// @end-config');
  if (a < 0 || b < 0) throw new Error('нет блока // @config … // @end-config');
  const config = src.slice(a + '// @config'.length, b).trim();
  const body = src.slice(0, a) + src.slice(b + '// @end-config'.length);
  return { config, body };
}
async function min(body) {
  const r = await minify(`export default async function(){${body}\n}`, {
    module: true, compress: { passes: 2 }, mangle: true,
    format: { comments: false, ascii_only: false, max_line_len: 800 },
  });
  const code = r.code.replace(/^export default async function\(\)\{/, '').replace(/\}$/, '');
  if (code === r.code) throw new Error('не удалось снять обёртку');
  return code;
}
const VERSION = (fs.readFileSync('CHANGELOG.md', 'utf8').match(/^## (\d+\.\d+\.\d+)/m) || [, 'dev'])[1];

const audit = split(read('audit.js')), ann = split(read('annotate.js')), outl = split(read('outline.js'));
const files = {
  'review.js': [
    `// DS Review ${VERSION} · review.js — проверка макета и пометки за один вызов use_figma.`,
    `// Собрано из src/audit.js и src/annotate.js (tools/build.mjs). Не правь этот файл — правь src/ и пересобери.`,
    `// Передай текст файла в use_figma ЦЕЛИКОМ и без изменений, заменив только значения ROOT_ID и MODE:`,
    `//   ROOT_ID — id экрана или секции из ссылки (node-id=12-34 → '12:34');`,
    `//   MODE — 'write' (проверить и поставить пометки), 'dry' (проверить и показать план пометок), 'report' (только проверить).`,
    `const ROOT_ID = '__NODE_ID__';`,
    `const MODE = 'write';`,
    `const ENGINE = 'ds-review ${VERSION}';`,
    `const __A = await (async () => {`,
    await min(audit.body),
    `})();`,
    `if (__A.error) return { engine: ENGINE, ...__A };`,
    `const __G = __A.groups.map(g => ({ id: g.ids[0], s: g.s, r: g.r, n: g.n, m: g.m }));`,
    `if (MODE === 'report') return { engine: ENGINE, ...__A, groups: __G };`,
    `const __N = await (async (ITEMS) => {`,
    await min(ann.body),
    `})(__A.groups);`,
    `return { engine: ENGINE, ...__A, groups: __G, annotations: __N };`,
  ],
  'annotate.js': [
    `// DS Review ${VERSION} · annotate.js — дописать пометки паттернов или убрать пометки DS Review.`,
    `// Собрано из src/annotate.js (tools/build.mjs). Не правь этот файл — правь src/ и пересобери.`,
    `// Передай текст в use_figma ЦЕЛИКОМ, заменив только ROOT_ID, MODE и ITEMS:`,
    `//   MODE — 'append' (дописать ITEMS к пометкам review.js), 'clear' (убрать пометки DS Review), 'dry' (показать план).`,
    `//   ITEMS — пункты { ids: ['id слоя'], n: 1, scr: 'id экрана', s: 'P', r: 'pattern', m: 'Что не так', fx: 'Как исправить', g: 'ключ гайда' }.`,
    ann.config.replace("const MODE = 'write';", "const MODE = 'append';"),
    await min(ann.body),
  ],
  'outline.js': [
    `// DS Review ${VERSION} · outline.js — структура экранов для проверки паттернов (только чтение).`,
    `// Собрано из src/outline.js (tools/build.mjs). Передай текст в use_figma целиком, заменив ROOT_ID и OFFSET.`,
    outl.config,
    await min(outl.body),
  ],
};
const check = process.argv.includes('--check');
let stale = [];
for (const [name, lines] of Object.entries(files)) {
  const code = lines.join('\n') + '\n';
  const path = `${OUT}/${name}`;
  if (check) { if (!fs.existsSync(path) || fs.readFileSync(path, 'utf8') !== code) stale.push(path); }
  else { fs.writeFileSync(path, code); console.log(`${path}: ${[...code].length} символов`); }
}
if (check && stale.length) { console.error(`Собранные скрипты устарели: ${stale.join(', ')}. Запусти node tools/build.mjs`); process.exit(1); }
if (check) console.log('OK  собранные скрипты совпадают с src/');
