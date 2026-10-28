// DS Review · audit.js — ТОЛЬКО ЧТЕНИЕ, ничего не меняет в файле.
// Запуск: передать весь текст файла в use_figma как `code`,
// подставив в ROOT_ID id из ссылки (node-id=12-34 → '12:34').
// Корень — экран (FRAME) или секция с флоу (SECTION).
const ROOT_ID = '__NODE_ID__';

// ===================== НАСТРОЙКИ (правит команда ДС) =====================
const CFG = {
  ds: '🍏',                              // актуальные компоненты, токены и стили
  web: ['🏀', '⚽'],                      // веб-библиотеки
  internal: ['🔶'],                      // служебные части компонентов ДС
  // Устаревшие компоненты: 🔥 и 🔴 (Pole Mobile 1.0) или [old] в названии.
  // Компоненты с другими эмодзи (🍔, 🖼️ …) — компоненты продуктовых команд: проверяем, из чего собраны.
  deprecatedEmo: ['🔥', '🔴', '🟥'], oldName: /\[old\]/i,
  platformLibs: ['🍋'],                  // компоненты команды Платформы — не проверяем
  // Не проверяем: платформенные элементы и служебные элементы флоу
  skip: [/^\[Tools\]/i, /^(Status bar|Home indicator|Keyboard|Navigation bar)\b/i],
  icon: /^(Base|V1|В1|Cosmetic)\s*\/\s*\d+\s*\//i,      // 🍏 Icons 2.0 (без эмодзи)
  iconBox: /^(Icon Box|Item Image)\s*\//i,
  illu: /illustration\s*\/\s*\d+/i,                      // 🍏 Illustration 2.0
  errorIllu: /illustration\s*\/\s*\d+\s*\/\s*(Error|Failed)\s*$/i, // «красный крест»
  iconMax: 48,                            // векторная графика до 48 px — это иконка
  okStyles: ['Background blur'],          // стили ДС без эмодзи
  // Основные кнопки (не Inline button): «🍏 Button / Base / Primary», «🏀 Buttons / Base / Primary»
  button: /^[^\w]*Buttons?\s*\/\s*(Base|Invert)\s*\//i,
  primary: /^[^\w]*Buttons?\s*\/\s*(Base|Invert)\s*\/\s*Primary/i,
  secondaryLabels: /^(Назад|Вернуться|Отмена|Отменить|Закрыть|Не сейчас|Позже|Пропустить)$/i,
  sheetHeader: /^🍏\s*Bottomsheet Header/i,
  // «Кладбище компонентов» в Pole Mobile 2.0 (ключи компонентов)
  deprecatedKeys: ['90fdb6a39fe8d98aebc5534c43c4e4b296eab1b7','f3b1ba8496827aa8f0c5ea861b7d79c66ff6c2b1','5b73881c1bf730d42874094acd8f1d3799234fb0','1f85e5a15f8e79fdf99f45e21e1ffa323a45ee66','fb3e6be32ace25d34375b2eb7399c2f3c4dadc6c','479153509f929c69aebf1c161936a7607d1394da','a0cfde1de174d20a51830eb9612497926abfa5a6','4eb2fe78e385aba24ec18088fc4401741491413f','1f59c3dc3f8523eadbca1ffbe07eb52973feceb8','e2f0801cad89c8c75dcb717ff356191465df9b35','dc6286d6d60e0c6abb1a2c5dec74f7401e18f15b','1025eb1ee65b207ed8a6aecf67dee18d90d2f625','2f1739b2bea1d83014b3e9630f45325ac7ae481d','7a571966a1be52e04df003f502f4530b0b00863a','894e1e93c9bae26a3d3bf066e6958a07b956bd37','f6a15f735d1f9d9da6a83f30be3d88ec6b479998','db201258d1d78a5eabf3ba414f4ee3e181aa0228','ea73aaccfa50367b1f3bec777ca47bc48ee5a8c6'],
  // Какие переопределения в инстансе считаем кастомизацией
  badOverride: {
    'цвет': 'fills fillStyleId',
    'обводка': 'strokes strokeStyleId strokeWeight strokeTopWeight stokeTopWeight strokeBottomWeight strokeLeftWeight strokeRightWeight strokeAlign dashPattern',
    'скругление': 'cornerRadius topLeftRadius topRightRadius bottomLeftRadius bottomRightRadius cornerSmoothing',
    'отступы': 'paddingLeft paddingRight paddingTop paddingBottom itemSpacing counterAxisSpacing',
    'типографика': 'textStyleId fontName fontSize fontWeight lineHeight letterSpacing textCase textDecoration paragraphSpacing',
    'тени': 'effects effectStyleId',
    'прозрачность': 'opacity blendMode',
    'токены': 'boundVariables',
  },
  // maxIdsPerGroup — сколько разных элементов с одной проблемой помечать на экране.
  // Один и тот же элемент в нескольких местах всегда получает одну пометку со списком остальных мест.
  maxScreens: 40, maxGroups: 300, maxIdsPerGroup: 5,
};
// Страницы компонентов в Pole Mobile 2.0 → ссылка «как правильно»
const COMP_PAGES = { 'accordion':'310-129480','background blur':'81339-16045','badge':'30382-6559','banner':'92327-14077','bottomsheet template':'37816-508','bottomsheet':'39007-11429','button':'124-41824','checkbox':'140-77241','description list':'8511-6308','chips':'130-43514','divider':'169-113841','empty state':'204-116304','filter':'130-43539','haptic':'87479-12983','input code':'421-141385','input':'229-116048','imaged selector':'70549-4239','loyalty label':'25551-4517','label':'130-44627','list':'135-44644','loader':'130-44628','menus':'1962-50243','notification':'135-44645','overlay onboarding':'89600-5380','overlay':'441-148648','progress bar':'22929-847','radiobutton':'140-77985','refresh control':'37977-30887','search':'135-103716','select':'260-117889','segmented control':'66684-26140','section':'91130-7998','skeleton':'384-129207','slider dots':'130-44629','slider icons':'61773-11401','slider':'17224-58518','stepper':'18430-37660','switch':'140-84961','tab bar':'537-48929','tabs':'130-43538','toast':'353-131852','top navigation':'130-44626','tooltip':'353-125398','title':'2412-25504','text area':'382-127204','text list':'87061-4964','subtitle':'2412-25504' };
// =========================================================================

const EMO = /^[.\s]*(\p{Extended_Pictographic})️?/u;
const emo = (s) => { const m = (s || '').match(EMO); return m ? m[1] : null; };
const strip = (s) => (s || '').replace(/^[.\s]*\p{Extended_Pictographic}️?\s*/u, '').replace(/^\[[^\]]*\]\s*/, '').trim();
const hex = (c) => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const DEPRECATED = new Set(CFG.deprecatedKeys);
const BAD = {}; for (const [ru, fs] of Object.entries(CFG.badOverride)) for (const f of fs.split(' ')) BAD[f] = ru;
function compGuide(name) {
  const b = strip(name).split('/')[0].trim().toLowerCase().replace(/\s+/g, ' ');
  const keys = Object.keys(COMP_PAGES);
  const k = keys.find(x => x === b) || keys.find(x => x === b.replace(/s$/, '')) || keys.find(x => b.includes(x));
  return k ? 'c:' + COMP_PAGES[k] : 'guide';
}
const replaceHint = (base) => CFG.skip.some(r => r.test(base))
  ? `Замени на «${base}» из 🍏 Platform Components 2.0 через Swap instance`
  : `Замени на актуальный 🍏 ${base.split('/')[0].trim()} через Swap instance`;

const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root) return { error: `Узел ${ROOT_ID} не найден. Проверь node-id в ссылке; для ветки нужен branchKey вместо fileKey.` };
let page = root; while (page && page.type !== 'PAGE') page = page.parent;
await figma.setCurrentPageAsync(page);

// ---------- экраны ----------
let screens = [];
if (root.type === 'SECTION' || root.type === 'PAGE') {
  const q = [...root.children];
  while (q.length) {
    const c = q.shift();
    if (c.visible === false) continue;
    if (c.type === 'SECTION') q.push(...c.children);
    else if (c.type === 'FRAME' && c.width >= 300 && c.width <= 480) screens.push(c);
  }
} else if (root.type === 'FRAME' || root.type === 'COMPONENT') screens = [root];
else return { error: `Корень «${root.name}» — ${root.type}. Нужна ссылка на экран (фрейм) или секцию с флоу.` };
if (!screens.length) return { error: 'В секции не найдено экранов шириной 300–480 px.' };
const truncatedScreens = screens.length > CFG.maxScreens;
screens = screens.slice(0, CFG.maxScreens);

// ---------- кэши ----------
const vCache = new Map(), sCache = new Map(), mCache = new Map();
async function vInfo(id) {
  if (vCache.has(id)) return vCache.get(id);
  let v = null; try { v = await figma.variables.getVariableByIdAsync(id); } catch (e) {}
  const info = { name: v ? v.name : '?', kind: 'unknown' };
  if (v) {
    const e = emo(v.name);
    if (e === CFG.ds) info.kind = 'ds';
    else if (e && CFG.web.includes(e)) info.kind = 'web';
    else if (e) info.kind = 'deprecated';
    else {
      let col = null; try { col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId); } catch (er) {}
      const cn = col ? col.name : '';
      if (cn === 'color' || /^(neutral|brand|brand alpha|system|system alpha|other|base|payment|social)\//.test(v.name)) info.kind = 'primitive';
      else if (['margins', 'spacing', 'radius', 'typography', 'motion'].includes(cn)) info.kind = 'ds';
    }
  }
  vCache.set(id, info); return info;
}
async function sName(id) {
  if (!id || typeof id !== 'string') return null;
  if (sCache.has(id)) return sCache.get(id);
  let s = null; try { s = await figma.getStyleByIdAsync(id); } catch (e) {}
  const n = s ? s.name : '?'; sCache.set(id, n); return n;
}
async function master(inst) {
  if (mCache.has(inst.id)) return mCache.get(inst.id);
  const mc = await inst.getMainComponentAsync();
  const set = mc && mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : null;
  const r = { mc, set, name: mc ? (set ? set.name : mc.name).trim() : '' };
  mCache.set(inst.id, r); return r;
}
const okStyle = (n) => n && (emo(n) === CFG.ds || CFG.okStyles.includes(n));
const notDs = (n) => CFG.web.includes(emo(n)) ? 'из веб-библиотеки' : 'не из 🍏 Pole Mobile 2.0';
const ICON_FIX = 'Возьми иконку из 🍏 Icons 2.0 и покрась 🍏 токеном icon/…. Нужной иконки нет — заказывай через иллюстратора';
const OLD_STYLE_TIP = ' Все старые стили быстро найдёт плагин ДС (в закрепе DoD ДС).';
async function boundName(n, key) { const b = n.boundVariables && n.boundVariables[key]; return b ? (await vInfo(b.id)).name : null; }

// ---------- находки ----------
const findings = [];
const skipped = { platform: 0, system: 0, product: 0 };
let SCR = null;
let CAPTURE = null;
const add = (id, r, s, m, fx, g) => (CAPTURE || findings).push({ id, scr: SCR, r, s, m, fx, g });

const visPaint = (p) => p.visible !== false && (p.opacity === undefined || p.opacity > 0);
const hasFill = (n) => Array.isArray(n.fills) && n.fills.some(visPaint);
const hasStroke = (n) => Array.isArray(n.strokes) && n.strokes.some(visPaint) && (n.strokeWeight === figma.mixed || n.strokeWeight > 0);
const visibleIn = (x, stop) => { let q = x; while (q && q !== stop) { if (q.visible === false) return false; q = q.parent; } return true; };
const labelOf = (b) => { const t = b.findAllWithCriteria({ types: ['TEXT'] }).find(t => visibleIn(t, b) && t.characters.trim()); return t ? t.characters.trim() : ''; };
function maxR(n) {
  if ('topLeftRadius' in n) return Math.max(n.topLeftRadius || 0, n.topRightRadius || 0, n.bottomLeftRadius || 0, n.bottomRightRadius || 0);
  return typeof n.cornerRadius === 'number' ? n.cornerRadius : 0;
}

async function checkPaints(n, prop, opts = {}) {
  const paints = n[prop];
  if (!Array.isArray(paints)) return;
  if (prop === 'strokes' && !hasStroke(n)) return;
  const id = opts.atId || n.id;
  const [label, verb] = opts.label ? [opts.label, 'задан']
    : prop === 'fills' ? (n.type === 'TEXT' ? ['Цвет текста', 'задан'] : ['Заливка', 'задана']) : ['Обводка', 'задана'];
  const hexRule = opts.rule || 'hex';
  const hexFix = hexRule === 'icon-hex'
    ? 'Цвет иконки — только 🍏 токеном (icon/… или контекстный токен компонента). Hex на иконках в продуктовых макетах не используем'
    : 'Поставь семантический 🍏 токен цвета (theme pack 1). Hex допустим только внутри сложных картинок';
  const styleId = prop === 'fills' ? n.fillStyleId : n.strokeStyleId;
  if (styleId && typeof styleId === 'string') {
    const sn = await sName(styleId);
    if (!okStyle(sn)) add(id, 'deprecated-style', 'E', `${label}: стиль «${sn}» ${notDs(sn)}`, 'Замени на 🍏 цветовой токен или 🍏 стиль градиента.' + OLD_STYLE_TIP, 'colors');
    return;
  }
  for (const p of paints) {
    if (!visPaint(p) || p.type === 'IMAGE' || p.type === 'VIDEO') continue;
    if (p.type === 'SOLID') {
      const b = p.boundVariables && p.boundVariables.color;
      if (!b) { add(id, hexRule, 'E', `${label} ${hex(p.color)} ${verb} вручную, без токена`, hexFix, hexRule === 'icon-hex' ? 'icons' : 'colors'); continue; }
      const v = await vInfo(b.id);
      if (v.kind === 'primitive') add(id, 'primitive', 'E', `${label}: примитив палитры «${v.name}» стоит напрямую`, 'Замени на семантический 🍏 токен. Примитивы из Pallete в макетах не используем', 'colors');
      else if (v.kind === 'web') add(id, 'web-token', 'E', `${label}: токен веб-библиотеки «${v.name}»`, `Замени на мобильный токен с 🍏 (обычно то же название: 🍏 ${strip(v.name)})`, 'colors');
      else if (v.kind === 'deprecated') add(id, 'deprecated-token', 'E', `${label}: устаревший токен «${v.name}»`, `Замени на актуальный токен с 🍏 (обычно то же название: 🍏 ${strip(v.name)})`, 'colors');
      else if (v.kind === 'unknown') add(id, 'unknown-token', 'W', `${label}: токен «${v.name}» не из Pole Mobile 2.0`, 'Проверь, что это 🍏 токен из theme pack 1', 'colors');
    } else if (p.type.startsWith('GRADIENT')) {
      add(id, hexRule, 'E', `${label}: градиент задан вручную`, 'Используй 🍏 стиль градиента (🍏 gradient/…) или собери из 🍏 токенов', 'colors');
    }
  }
}

async function checkEffects(n) {
  if (!Array.isArray(n.effects) || !n.effects.some(e => e.visible !== false)) return;
  if (n.effectStyleId && typeof n.effectStyleId === 'string') {
    const sn = await sName(n.effectStyleId);
    if (!okStyle(sn)) add(n.id, 'deprecated-style', 'E', `Эффект: стиль «${sn}» ${notDs(sn)}`, 'Используй 🍏 тени S, M, ML, L, XL или Bottom panel.' + OLD_STYLE_TIP, 'shadows');
    return;
  }
  add(n.id, 'effect-no-style', 'E', 'Тень или эффект заданы вручную, без стиля', 'Используй 🍏 тени S, M, ML, L, XL, Bottom panel. На карточках и плавающих блоках тени не ставим', 'shadows');
}

async function checkText(n) {
  let ids = [];
  if (n.textStyleId === figma.mixed) { try { ids = n.getStyledTextSegments(['textStyleId']).map(s => s.textStyleId); } catch (e) { ids = ['']; } }
  else ids = [n.textStyleId];
  for (const id of [...new Set(ids)]) {
    if (!id) { add(n.id, 'no-text-style', 'E', 'Текст без стиля типографики', 'Примени 🍏 текстовый стиль (Title / Body / Caption)', 'typography'); continue; }
    const sn = await sName(id);
    if (!okStyle(sn)) add(n.id, 'deprecated-style', 'E', `Стиль текста «${sn}» ${notDs(sn)}`, `Замени на 🍏 стиль того же размера (например, 🍏 ${strip(sn)}).` + OLD_STYLE_TIP, 'typography');
  }
  await checkPaints(n, 'fills');
}

// ---------- скругления ----------
const CORNERS = ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'];
const BY_VALUE = { 28: ['container/section', 'секции'], 20: ['container/block', 'блока'], 12: ['container/card', 'карточки/плитки'] };
async function checkRadius(n, role) {
  const r = maxR(n); if (!r) return;
  const names = [];
  if ('topLeftRadius' in n) { for (const k of CORNERS) if (n[k] > 0) names.push(await boundName(n, k)); }
  else names.push(await boundName(n, 'cornerRadius'));
  let want = null, what = null;
  if (role === 'section') [want, what] = ['container/section', 'секции'];
  else if ((n.type === 'FRAME' || n.type === 'RECTANGLE') && n.width >= 40 && n.height >= 40 && (hasFill(n) || hasStroke(n)) && BY_VALUE[r]) [want, what] = BY_VALUE[r];
  if (names.some(x => !x)) {
    if (want) add(n.id, 'container-radius', 'E', `Скругление ${what} ${r}px задано без токена`, `Поставь токен radius → ${want}`, 'p-radius');
    else add(n.id, 'radius-unbound', 'W', `Скругление ${r}px задано без токена`, r >= 999 || r >= Math.min(n.width, n.height) / 2 ? 'Поставь токен radius → corner/round' : 'Поставь токен из коллекции radius (corner/2…28). Значения вне шкалы не используем', 'p-radius');
    return;
  }
  const wrong = want && names.find(x => x !== want);
  if (!wrong) return;
  if (wrong.replace(/с/g, 'c') === want) add(n.id, 'outdated-library', 'E', `Скругление ${what} на токене из старой версии библиотеки («${wrong}» с кириллицей)`, 'Прими обновления библиотеки 🍏 Pole Mobile 2.0 (Assets → Updates) — токен заменится на container/…', 'guide');
  else add(n.id, 'container-radius', 'E', `Скругление ${what} на токене «${wrong}»`, `Замени на radius → ${want}`, 'p-radius');
}

// ---------- отступы ----------
const sectionIds = new Set(), boxIds = new Set();
function isBox(c) {
  if (c.type !== 'FRAME' || !c.layoutMode || c.layoutMode === 'NONE' || hasFill(c) || maxR(c) > 0) return false;
  const kids = (c.children || []).filter(x => x.visible !== false);
  return kids.length >= 1 && (c.paddingLeft > 0 || c.paddingTop > 0) && kids.some(x => (x.type === 'FRAME' || x.type === 'INSTANCE') && (hasFill(x) || maxR(x) > 0));
}
async function checkContainer(n, screenW) {
  if (n.type !== 'FRAME' || n.layoutMode !== 'VERTICAL' || n.width < screenW * 0.9) return;
  const kids = n.children.filter(c => c.visible !== false);
  const secs = kids.filter(c => c.type === 'FRAME' && c.width >= n.width * 0.95 && (hasFill(c) || maxR(c) > 0));
  const round4 = (x) => 'topLeftRadius' in x ? Math.min(x.topLeftRadius, x.topRightRadius, x.bottomLeftRadius, x.bottomRightRadius) > 0 : maxR(x) > 0;
  if (secs.length < 2 || !(n.itemSpacing > 0 || secs.filter(round4).length >= 2)) return;
  secs.forEach(s => sectionIds.add(s.id));
  kids.filter(c => !sectionIds.has(c.id) && c.width >= n.width * 0.95 && isBox(c)).forEach(b => boxIds.add(b.id));
  if (kids.length > 1 && n.primaryAxisAlignItems !== 'SPACE_BETWEEN') {
    const gn = await boundName(n, 'itemSpacing');
    if (gn !== 'page/margin') add(n.id, 'container-spacing', 'E', gn ? `Отступ между секциями на токене «${gn}»` : `Отступ между секциями ${n.itemSpacing}px задан без токена`, 'Поставь в gap контейнера токен spacing → page/margin (4px)', 'spacing');
  }
  const bad = [];
  for (const k of ['paddingTop', 'paddingBottom']) if (n[k] > 0 && (await boundName(n, k)) !== 'page/padding') bad.push(`${k === 'paddingTop' ? 'сверху' : 'снизу'} ${n[k]}px`);
  if (bad.length) add(n.id, 'container-spacing', 'E', `Отступы контейнера с секциями без токена page/padding: ${bad.join(', ')}`, 'Поставь токен spacing → page/padding (4px)', 'spacing');
}
async function checkBox(n) {
  const bad = [];
  for (const [k, want] of [['paddingTop', 'box/padding'], ['paddingBottom', 'box/padding'], ['paddingLeft', 'box/padding-horizontal'], ['paddingRight', 'box/padding-horizontal']]) {
    if (!(n[k] > 0)) continue;
    const bn = await boundName(n, k);
    if (bn !== want) bad.push(`${k.replace('padding', '').toLowerCase()} ${n[k]}px${bn ? ` (${bn})` : ''}`);
  }
  if (bad.length) add(n.id, 'box-spacing', 'E', `Отступы врезки не на токенах: ${bad.join(', ')}`, 'Поставь box/padding (верх и низ, 12px) и box/padding-horizontal (бока, 16px)', 'spacing');
}
async function checkGrid(n) {
  if (n.type !== 'FRAME' || !n.layoutMode || n.layoutMode === 'NONE' || sectionIds.has(n.id) || boxIds.has(n.id)) return;
  const bad = [];
  for (const k of ['itemSpacing', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight']) {
    if (k === 'itemSpacing' && n.primaryAxisAlignItems === 'SPACE_BETWEEN') continue;
    const v = n[k]; if (typeof v !== 'number' || v <= 0 || v === 2 || v % 4 === 0) continue;
    if (!(await boundName(n, k))) bad.push(`${v}px`);
  }
  if (bad.length) add(n.id, 'off-grid', 'W', `Отступы не кратны 4px: ${[...new Set(bad)].join(', ')}`, 'Используй шкалу margins (2, 4, 8, 12, 16, 20, 24, 28, 32)', 'p-spacing');
}

// ---------- кнопки и иллюстрации (паттерны) ----------
const primaries = [];
function notePrimary(markId, label) {
  if (!CAPTURE) primaries.push(markId);
  if (CFG.secondaryLabels.test(label)) add(markId, 'secondary-primary', 'P', `Primary-кнопка «${label}» — слишком акцентно для второстепенного действия`, 'Для «Назад», «Отмена», «Закрыть» используй Secondary или Tertiary. Primary — только для главного действия', 'c:124-41824');
}
function noteIllustration(markId, illuName) {
  if (CFG.errorIllu.test(illuName)) add(markId, 'illustration-meaning', 'W', `Иллюстрация «${illuName.split('/').pop().trim()}» (красный крест) — только для критичных ошибок`, 'Если ситуация некритичная (истёк срок, недоступно, ничего не найдено, нужно подождать) — поставь Warning или тематическую иллюстрацию из 🍏 Illustration 2.0', 'p-empty');
}
async function scanNested(n, name) {
  if (CFG.button.test(name)) { if (CFG.primary.test(name)) notePrimary(n.id, labelOf(n)); return; }
  for (const x of n.findAllWithCriteria({ types: ['INSTANCE'] })) {
    if (!visibleIn(x, n)) continue;
    const m = await master(x);
    if (CFG.primary.test(m.name)) notePrimary(n.id, labelOf(x));
    else if (m.mc && CFG.illu.test(m.mc.name)) noteIllustration(n.id, m.mc.name);
  }
}
async function checkButtonOrder(n) {
  if (n.type !== 'FRAME' || n.layoutMode !== 'VERTICAL') return;
  const btns = [];
  for (const c of n.children) {
    if (c.type !== 'INSTANCE' || c.visible === false) continue;
    const m = await master(c);
    if (CFG.button.test(m.name)) btns.push({ c, primary: CFG.primary.test(m.name) });
  }
  const iP = btns.findIndex(b => b.primary);
  if (btns.length >= 2 && iP > 0) add(n.id, 'button-order', 'P', `Primary-кнопка стоит ниже «${labelOf(btns[0].c)}»`, 'Кнопки идут по важности сверху вниз: Primary сверху. Нижняя кнопка — заключительное действие (Secondary «Понятно», «Закрыть»)', 'p-bottomsheet');
}

// ---------- компоненты ----------
const J = (v) => { try { return typeof v === 'symbol' ? 'mixed' : JSON.stringify(v); } catch (e) { return '?'; } };
async function twin(n, oid, sub) {
  const { mc } = await master(n); if (!mc) return null;
  if (oid === n.id) return mc;
  const rest = oid.replace(/^I/, '').split(';').slice(n.id.replace(/^I/, '').split(';').length);
  let t = null;
  try { if (rest.length) t = await figma.getNodeByIdAsync(rest.length > 1 ? 'I' + rest.join(';') : rest[0]); } catch (e) {}
  if (t || !sub) return t;
  const path = []; let x = sub;
  while (x && x.id !== n.id) { if (!x.parent) return null; path.unshift(x.parent.children.indexOf(x)); x = x.parent; }
  t = mc; for (const i of path) { t = t && 'children' in t ? t.children[i] : null; }
  return t && t.type === sub.type && t.name === sub.name ? t : null;
}
async function iconOnDsToken(sub, f) {
  let p = sub.parent, icon = false;
  for (let i = 0; p && i < 4 && !icon; i++, p = p.parent) icon = p.type === 'INSTANCE' && CFG.icon.test(p.name.trim());
  const paints = icon && Array.isArray(sub[f]) ? sub[f].filter(visPaint) : [];
  for (const pt of paints) { const b = pt.boundVariables && pt.boundVariables.color; if (!b || (await vInfo(b.id)).kind !== 'ds') return false; }
  return paints.length > 0;
}
async function sameAsMaster(n, oid, sub, f) {
  if (sub && (f === 'fills' || f === 'strokes') && await iconOnDsToken(sub, f)) return true;
  const t = await twin(n, oid, sub); if (!t || !sub) return false;
  try { return J(sub[f]) === J(t[f]); } catch (e) { return false; }
}
async function checkOverrides(n, name, g) {
  const bad = {}; const hidden = [];
  for (const o of n.overrides || []) {
    let sub;
    const where = async () => { if (o.id === n.id) return 'сам компонент'; sub = sub || await figma.getNodeByIdAsync(o.id); return sub ? `«${sub.name}»` : 'вложенный слой'; };
    for (const f of o.overriddenFields) {
      if (f === 'visible') {
        if (o.id === n.id) continue;
        sub = sub || await figma.getNodeByIdAsync(o.id);
        if (sub && !(sub.componentPropertyReferences && sub.componentPropertyReferences.visible)) hidden.push(sub.name);
        continue;
      }
      const ru = BAD[f]; if (!ru) continue;
      const w = await where();
      if (await sameAsMaster(n, o.id, o.id === n.id ? n : sub, f)) continue;
      (bad[ru] = bad[ru] || new Set()).add(w);
    }
  }
  const parts = Object.entries(bad).map(([k, v]) => `${k} (${[...v].slice(0, 3).join(', ')})`);
  if (parts.length) {
    const fakeState = bad['прозрачность'] ? ' Прозрачность похожа на имитацию состояния — используй свойство State.' : '';
    add(n.id, 'customized', 'E', `«${name}» закастомлен: ${parts.join('; ')}`, `Сбрось переопределения (Reset all changes) и настрой вид только через свойства компонента. Нужного варианта нет — напиши в Приёмную ДС.${fakeState}`, g);
  }
  if (hidden.length) add(n.id, 'hidden-layer', 'W', `В «${name}» вручную скрыты слои: ${[...new Set(hidden)].slice(0, 3).join(', ')}`, 'Скрывай элементы через свойства компонента. Если такого свойства нет — напиши в Приёмную ДС', g);
}
async function checkIconColor(n, name) {
  for (const o of n.overrides || []) {
    if (!o.overriddenFields.includes('fills') || o.id === n.id) continue;
    const sub = await figma.getNodeByIdAsync(o.id);
    if (sub) await checkPaints(sub, 'fills', { atId: n.id, label: `Цвет иконки «${name.split('/').pop().trim()}»`, rule: 'icon-hex' });
  }
}
async function checkInstance(n) {
  const { mc, set, name } = await master(n);
  if (!mc) { add(n.id, 'deprecated-component', 'E', 'Мастер-компонент не найден — его удалили из библиотеки', 'Замени на актуальный 🍏 компонент через Swap instance', 'guide'); return; }
  const e = emo(name), g = compGuide(name), base = strip(name);
  if (DEPRECATED.has(mc.key) || (set && DEPRECATED.has(set.key))) { add(n.id, 'deprecated-component', 'E', `«${name}» — компонент с «Кладбища компонентов»`, replaceHint(base), g); return; }
  if (e === CFG.ds) {
    if (!mc.remote) { add(n.id, 'local-ds', 'E', `«${name}» — локальная копия компонента, а не инстанс из библиотеки`, 'Вставь компонент из Assets → 🍏 Pole Mobile 2.0 и удали локальную копию', g); return; }
    if (CFG.sheetHeader.test(name) && n.parent && n.parent.type !== 'PAGE') {
      add(n.parent.id, 'manual-bottomsheet', 'E', 'Шторка собрана вручную: 🍏 Bottomsheet Header + свои фреймы', 'Собери шторку из 🍏 Bottomsheet: контент — в слот Content, пункты списка — 🍏 List. Для промо-шторки с картинкой — 🍏 Bottomsheet template', 'c:39007-11429');
    }
    await checkOverrides(n, name, g);
    await scanNested(n, name);
    return;
  }
  if (e && CFG.platformLibs.includes(e)) { skipped.platform++; return; }
  if (e && CFG.web.includes(e)) { add(n.id, 'web-component', 'E', `«${name}» — компонент веб-библиотеки`, `Замени на мобильный 🍏 ${base.split('/')[0].trim()} из Pole Mobile 2.0`, g); await scanNested(n, name); return; }
  if (e && CFG.internal.includes(e)) { add(n.id, 'internal-component', 'E', `«${name}» — служебная часть компонента ДС, отдельно её не используют`, 'Используй готовый 🍏 компонент целиком', g); return; }
  if ((e && CFG.deprecatedEmo.includes(e)) || CFG.oldName.test(name)) { add(n.id, 'deprecated-component', 'E', `«${name}» — устаревший компонент из Pole Mobile 1.0`, replaceHint(base), g); return; }
  if (CFG.skip.some(r => r.test(name))) { skipped.system++; return; }
  if (CFG.icon.test(name) || CFG.iconBox.test(name)) {
    if (!mc.remote) add(n.id, 'local-asset', 'W', `Иконка «${name}» — локальный компонент`, 'Бери иконки только из 🍏 Icons 2.0', 'icons');
    else await checkIconColor(n, name);
    return;
  }
  if (CFG.illu.test(name) || CFG.illu.test(mc.name)) {
    if (!mc.remote) add(n.id, 'local-asset', 'W', `Иллюстрация «${name}» — локальный компонент`, 'Бери иллюстрации только из 🍏 Illustration 2.0', 'illustrations');
    else noteIllustration(n.id, mc.name);
    return;
  }
  await checkProduct(n, name, mc);
}

// ---------- компоненты продуктовых команд ----------
let FILE_KEY = null; try { FILE_KEY = figma.fileKey || null; } catch (e) {}
const prodCache = new Map(); let prodDepth = 0;
const GENERIC = /^(Frame|Group|Rectangle|Vector|Ellipse|Container|Content|Wrapper|Text|Auto ?layout)\s*\d*$/i;
const firstText = (x) => { const t = 'children' in x ? x.findAllWithCriteria({ types: ['TEXT'] }).find(t => t.characters.trim()) : null; return t ? t.characters.trim() : ''; };
function describe(x) {
  if (!x) return 'слой';
  if (x.type === 'TEXT') return `«${x.characters.trim().slice(0, 28)}»`;
  const nm = x.name.trim(), t = firstText(x);
  return `«${(GENERIC.test(nm) && t ? t : nm).slice(0, 28)}»`;
}
function lookalike(n) {
  if (n.type !== 'FRAME' || !n.layoutMode || n.layoutMode === 'NONE') return null;
  const kids = n.children.filter(c => c.visible !== false);
  const texts = kids.filter(c => c.type === 'TEXT');
  const filled = (hasFill(n) || hasStroke(n)) && maxR(n) > 0;
  if (filled && n.height <= 32 && texts.length === 1 && kids.length <= 3) return ['самодельный лейбл или чип', '🍏 Label, 🍏 Chips или 🍏 Badge', 'c:130-44627'];
  if (filled && n.height >= 36 && n.height <= 56 && n.width >= 100 && texts.length === 1 && kids.length <= 2) return ['самодельная кнопка', '🍏 Button', 'c:124-41824'];
  const stack = (c) => c.type === 'FRAME' && c.layoutMode === 'VERTICAL' && c.findAllWithCriteria({ types: ['TEXT'] }).length >= 2;
  const small = (c) => c.type === 'INSTANCE' || VEC.includes(c.type) || (c.width <= 48 && c.height <= 48);
  const row = (r) => r.type === 'FRAME' && r.layoutMode === 'HORIZONTAL' && r.width >= 200 && r.children.some(stack) && small(r.children[r.children.length - 1]);
  if (row(n) && n.parent && n.parent.layoutMode === 'VERTICAL' && n.parent.children.filter(row).length >= 2) return ['самодельная строка списка', '🍏 List', 'c:135-44644'];
  return null;
}
const PROD_SKIP = ['off-grid', 'radius-unbound', 'unknown-token', 'hidden-layer', 'multi-primary'];
async function summarize(got) {
  const by = new Map(); let sev = null;
  for (const f of got) {
    if (PROD_SKIP.includes(f.r)) continue;
    sev = f.s === 'E' || sev === 'E' ? 'E' : f.s === 'P' || sev === 'P' ? 'P' : 'W';
    if (f.r === 'product-component') { const p = f.p || []; by.set(f.m, { m: `«${f.name}» → ${p.length > 1 ? `(${p.join('; ')})` : p[0]}`, names: [] }); continue; }
    if (f.m.startsWith('«')) { by.set(f.m, by.get(f.m) || { m: f.m, names: [] }); continue; } // имя уже в тексте
    const x = await figma.getNodeByIdAsync(f.id);
    const b = by.get(f.m) || { m: f.m.charAt(0).toLowerCase() + f.m.slice(1), names: [] };
    const d = describe(x); if (!b.names.includes(d)) b.names.push(d);
    by.set(f.m, b);
  }
  const parts = [...by.values()].map(b => b.names.length ? `${b.names.slice(0, 3).join(', ')}${b.names.length > 3 ? ` и ещё ${b.names.length - 3}` : ''} — ${b.m}` : b.m);
  return { sev, parts: parts.length > 6 ? [...parts.slice(0, 6), `и ещё ${parts.length - 6}`] : parts };
}
async function checkProduct(n, name, mc) {
  let res = prodCache.get(mc.id);
  if (!res) {
    if (prodDepth >= 3) return;
    const prev = CAPTURE; CAPTURE = []; prodDepth++;
    for (const c of n.children || []) await walk(c, Infinity);
    const got = CAPTURE; CAPTURE = prev; prodDepth--;
    res = await summarize(got); prodCache.set(mc.id, res);
  }
  if (!res.parts.length) { skipped.product++; return; }
  const where = mc.remote ? 'Компонент лежит в библиотеке команды — поправь его там и опубликуй обновление'
    : `Правь мастер-компонент${FILE_KEY ? ` ([открыть](https://www.figma.com/design/${FILE_KEY}/?node-id=${mc.id.replace(/:/g, '-')}))` : ''}`;
  add(n.id, 'product-component', res.sev, `«${name}» — компонент команды собран не только из 🍏. Внутри: ${res.parts.join('; ')}`,
    `Собери «${name}» из 🍏 компонентов:\nЛейблы и чипы — 🍏 Label / Chips / Badge\nСтроки — 🍏 List\nКнопки — 🍏 Button\nЦвета и тексты — 🍏 токены и стили\n${where} — исправится во всех копиях`, 'guide');
  Object.assign((CAPTURE || findings).at(-1), { p: res.parts, name });
}

// ---------- обход ----------
const VEC = ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON'];
const COLOR_RULES = ['hex', 'icon-hex', 'primitive', 'deprecated-token', 'web-token', 'deprecated-style'];
async function walk(n, screenW) {
  if (n.visible === false) return 1;
  const t = n.type;
  if (t === 'INSTANCE') { await checkInstance(n); return 0; }
  if (VEC.includes(t)) {
    if (Math.max(n.width, n.height) <= CFG.iconMax) { await checkPaints(n, 'fills', { label: 'Цвет иконки', rule: 'icon-hex' }); await checkPaints(n, 'strokes', { label: 'Цвет иконки', rule: 'icon-hex' }); }
    return 3;
  }
  if (n.id !== SCR && (t === 'FRAME' || t === 'GROUP') && (CFG.icon.test(n.name.trim()) || CFG.illu.test(n.name))) {
    add(n.id, 'detached', 'E', `«${n.name.trim()}» — раздетаченная ${CFG.illu.test(n.name) ? 'иллюстрация' : 'иконка'}`, CFG.illu.test(n.name) ? 'Вставь иллюстрацию инстансом из 🍏 Illustration 2.0' : 'Вставь иконку инстансом из 🍏 Icons 2.0 и покрась 🍏 токеном icon/…', CFG.illu.test(n.name) ? 'illustrations' : 'icons');
    return 0;
  }
  const ne = emo(n.name);
  if (n.id !== SCR && ['FRAME', 'GROUP', 'RECTANGLE'].includes(t) && (ne === CFG.ds || CFG.deprecatedEmo.includes(ne))) {
    const e = ne;
    add(n.id, 'detached', 'E', `«${n.name}» — раздетаченный компонент${e === CFG.ds ? '' : ' (к тому же устаревший)'}`, `Замени слой на инстанс 🍏 ${strip(n.name).split('/')[0].trim()} из Pole Mobile 2.0. Чего-то не хватает в компоненте — напиши в Приёмную ДС`, compGuide(n.name));
    return 0;
  }
  if (t === 'TEXT') { await checkText(n); return 0; }
  const F = () => CAPTURE || findings;
  const start = F().length;
  if (t === 'RECTANGLE' || t === 'ELLIPSE' || t === 'LINE') {
    if (Array.isArray(n.fills) && n.fills.some(p => p.type === 'IMAGE' && p.visible !== false)) {
      if (t === 'RECTANGLE') await checkRadius(n, null);
      return F().length > start ? 0 : 2;
    }
    const img = (x) => x && Array.isArray(x.fills) && x.fills.some(p => p.type === 'IMAGE' && p.visible !== false);
    const grad = Array.isArray(n.fills) && n.fills.some(visPaint) && n.fills.filter(visPaint).every(p => p.type.startsWith('GRADIENT'));
    if (grad && (img(n.parent) || n.parent.children.some(x => x !== n && img(x)))) return 2;
    await checkPaints(n, 'fills'); await checkPaints(n, 'strokes'); await checkEffects(n);
    if (t === 'RECTANGLE') await checkRadius(n, null);
    return 1;
  }
  if (!('children' in n)) return 0;
  const isFrame = t === 'FRAME' || t === 'COMPONENT';
  if (isFrame && CAPTURE && n.id !== SCR) {
    const lk = lookalike(n);
    if (lk) { add(n.id, 'ds-lookalike', 'W', `${lk[0]} вместо ${lk[1]}`, `Замени на ${lk[1]}`, lk[2]); return 0; }
  }
  if (isFrame) {
    await checkPaints(n, 'fills'); await checkPaints(n, 'strokes');
    if (n.id !== SCR) await checkEffects(n);
    await checkRadius(n, sectionIds.has(n.id) ? 'section' : null);
    if (boxIds.has(n.id)) await checkBox(n);
    await checkContainer(n, screenW);
    await checkGrid(n);
    await checkButtonOrder(n);
  }
  const lv = [];
  for (const c of n.children) lv.push(await walk(c, screenW));
  const plain = !isFrame || (!hasFill(n) && !maxR(n) && !hasStroke(n));
  if (n.id !== SCR && plain && lv.length && lv.every(x => x >= 1) && lv.some(x => x >= 2)) {
    const removed = F().splice(start);
    const vec = lv.some(x => x === 3) && !lv.some(x => x === 2);
    if (vec && Math.max(n.width, n.height) <= CFG.iconMax) {
      if (removed.some(f => COLOR_RULES.includes(f.r))) add(n.id, 'icon-hex', 'E', `«${n.name}» — локально нарисованная иконка с цветом не на 🍏 токене`, ICON_FIX, 'icons');
      else add(n.id, 'local-asset', 'W', `«${n.name}» похож на локально нарисованную иконку`, 'Бери иконки из 🍏 Icons 2.0. Нужной нет — заказывай через иллюстратора', 'icons');
    }
    return vec ? 3 : 2;
  }
  if (n.id !== SCR && Math.max(n.width, n.height) <= 64 && F().slice(start).some(f => f.r === 'icon-hex')) {
    const tail = F().splice(start);
    F().push(...tail.filter(f => f.r !== 'icon-hex' && f.r !== 'hex'));
    add(n.id, 'icon-hex', 'E', `«${n.name}» — иконка собрана вручную, цвета заданы hex`, ICON_FIX, 'icons');
  }
  return 0;
}

for (const s of screens) {
  SCR = s.id;
  primaries.length = 0;
  await walk(s, s.width);
  if (primaries.length > 1) for (const id of [...new Set(primaries)].slice(1)) add(id, 'multi-primary', 'P', `На экране ${primaries.length} Primary-кнопки — главная должна быть одна`, 'Оставь Primary только для главного действия, остальные — Secondary, Border или Tertiary', 'c:124-41824');
}

// ---------- группировка ----------
const subCache = new Map();
async function subject(id) {
  if (subCache.has(id)) return subCache.get(id);
  let s = id; const n = await figma.getNodeByIdAsync(id);
  if (n && n.type === 'INSTANCE') { const { mc, set } = await master(n); s = mc ? 'c:' + (set ? set.key : mc.key) : 'n:' + n.name.trim(); }
  else if (n) s = `n:${n.name.trim()}|${Math.round(n.width || 0)}`;
  subCache.set(id, s); return s;
}
const scrIdx = new Map(screens.map((s, i) => [s.id, i]));
const groups = new Map();
for (const f of findings) {
  const k = `${f.r}|${f.m}|${await subject(f.id)}`;
  let g = groups.get(k);
  if (!g) { g = { ids: [f.id], n: 0, scr: f.scr, r: f.r, s: f.s, m: f.m, fx: f.fx, g: f.g, at: new Map(), seen: new Set() }; groups.set(k, g); }
  if (g.seen.has(f.id)) continue;
  g.seen.add(f.id); g.n++;
  if (f.id === g.ids[0]) continue;
  const a = g.at.get(f.scr) || { scr: f.scr, id: f.id, n: 0 }; a.n++; g.at.set(f.scr, a);
}
const perScr = new Map(); const out = [];
const sname = (id) => { const s = screens[scrIdx.get(id)]; const nm = s ? s.name : ''; return nm.length > 40 ? nm.slice(0, 39) + '…' : nm; };
for (const g of groups.values()) {
  const k = `${g.scr}|${g.r}|${g.m}`;
  const first = perScr.get(k);
  if (!first) perScr.set(k, { g, cnt: 1 });
  else if (first.cnt >= CFG.maxIdsPerGroup) { first.g.similar = (first.g.similar || 0) + g.n; continue; }
  else first.cnt++;
  const more = [...g.at.values()].sort((a, b) => (a.scr === g.scr ? -1 : b.scr === g.scr ? 1 : scrIdx.get(a.scr) - scrIdx.get(b.scr)))
    .slice(0, 8).map(a => ({ scr: a.scr, name: sname(a.scr), id: a.id, n: a.n }));
  delete g.at; delete g.seen;
  if (more.length) g.more = more;
  out.push(g);
}
const ORDER = { E: 0, P: 1, W: 2 };
const all = out.sort((a, b) => ORDER[a.s] - ORDER[b.s]);
const byRule = {};
for (const f of findings) { const k = `${f.s} ${f.r}`; byRule[k] = (byRule[k] || 0) + 1; }
return {
  root: { id: root.id, name: root.name, type: root.type, page: page.name },
  screens: screens.map(s => ({ id: s.id, name: s.name })),
  truncatedScreens,
  totals: { errors: findings.filter(f => f.s === 'E').length, patterns: findings.filter(f => f.s === 'P').length, checks: findings.filter(f => f.s === 'W').length, groups: all.length },
  byRule,
  skipped,
  groups: all.slice(0, CFG.maxGroups),
  truncatedGroups: all.length > CFG.maxGroups,
};
