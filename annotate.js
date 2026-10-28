// DS Review · annotate.js — ставит пометки (аннотации Figma) в макет. ИЗМЕНЯЕТ ФАЙЛ.
// Запуск: передать весь текст в use_figma как `code`, подставив:
//   ROOT_ID — тот же id, что в audit.js;
//   MODE    — 'write'  (убрать старые пометки DS Review в ROOT и поставить новые),
//             'append' (дописать следующую порцию, ничего не убирая — для больших флоу),
//             'clear'  (только убрать пометки DS Review), 'dry' (ничего не менять, показать план);
//   ITEMS   — массив пунктов (см. SKILL.md, шаг 5).
// Чужие аннотации (логика, контент, разработка) не трогаем.
const ROOT_ID = '__NODE_ID__';
const MODE = 'write';
const ITEMS = [
  // { ids: ['12:34'], n: 1, s: 'E', r: 'hex', m: 'Что не так', fx: 'Как исправить', g: 'colors' },
  // Тот же элемент в нескольких местах — одна пометка на ids[0], остальные места в more:
  // { ids: ['12:34'], n: 7, scr: '12:1', more: [{ scr: '12:1', name: 'Экран', id: '12:40', n: 2 }, …], … },
];

// ===================== НАСТРОЙКИ (правит команда ДС) =====================
const CATEGORY = { label: 'DS Review', color: 'red' };
const SEV = { E: '🔴 Ошибка', W: '🟡 Проверить', P: '🔵 Паттерн' };
// Правило → пункт чек-листа ✅ Checklist DS
const CHECK = {
  'outdated-library': 'Файл обновлен',
  'deprecated-component': 'Токены и компоненты из либы с 🍏', 'web-component': 'Токены и компоненты из либы с 🍏',
  'internal-component': 'Токены и компоненты из либы с 🍏', 'local-ds': 'Токены и компоненты из либы с 🍏',
  'product-component': 'Токены и компоненты из либы с 🍏', 'icon-hex': 'Токены и компоненты из либы с 🍏',
  'ds-lookalike': 'Токены и компоненты из либы с 🍏', 'local-asset': 'Токены и компоненты из либы с 🍏',
  'hex': 'Токены и компоненты из либы с 🍏', 'primitive': 'Токены и компоненты из либы с 🍏',
  'deprecated-token': 'Токены и компоненты из либы с 🍏', 'unknown-token': 'Токены и компоненты из либы с 🍏',
  'web-token': 'Токены и компоненты из либы с 🍏',
  'deprecated-style': 'Токены и компоненты из либы с 🍏', 'no-text-style': 'Токены и компоненты из либы с 🍏',
  'effect-no-style': 'Токены и компоненты из либы с 🍏',
  'container-spacing': 'Токены отступов Spacing в контейнере с секциями и во врезках',
  'box-spacing': 'Токены отступов Spacing в контейнере с секциями и во врезках',
  'container-radius': 'Токены скруглений Container в секциях, блоках и карточках',
  'radius-unbound': 'Токены скруглений Container в секциях, блоках и карточках',
  'customized': 'Компоненты не закастомлены', 'hidden-layer': 'Компоненты не закастомлены',
  'detached': 'Компоненты не раздетачены', 'manual-bottomsheet': 'Компоненты не раздетачены',
  'off-grid': 'Паттерны: модуль 4px',
  'button-order': 'Паттерны: кнопки', 'secondary-primary': 'Паттерны: кнопки', 'multi-primary': 'Паттерны: кнопки',
  'illustration-meaning': 'Паттерны: подбор иллюстрации', 'pattern': 'Паттерны Magnit app 2.0',
};
const PM = 'https://www.figma.com/design/tN0vhB9QeckIvUKC6T8zWb/Pole-Mobile-2.0?node-id=';
const PT = 'https://www.figma.com/design/XgGTUV55rY4ni69XnFYXVJ/Patterns-Magnit-app-2.0?node-id=';
const LINKS = {
  guide: ['Гайд по использованию ДС', PM + '90932-1585'],
  colors: ['Токены цвета', PM + '2-26'],
  typography: ['Типографика', PM + '130-43537'],
  shadows: ['Тени', PM + '441-148502'],
  spacing: ['Spacing', PM + '83317-9857'],
  themes: ['Темизация', PM + '65793-15658'],
  animation: ['Анимация', PM + '90707-6259'],
  graveyard: ['Кладбище компонентов', PM + '51868-6671'],
  icons: ['🍏 Icons 2.0', 'https://www.figma.com/design/ep0MkPmVw5fxARZcZ0HEue/Icons-2.0?node-id=1-2'],
  illustrations: ['🍏 Illustration 2.0', 'https://www.figma.com/design/Qm4IeMA7UANKaANCRHmYHA/Illustration-2.0?node-id=20-31'],
  checklist: ['✅ Checklist DS', 'https://www.figma.com/design/ef78UYFlsx3lyBWgHpsB3h/Tools?node-id=546-633'],
  'p-basic': ['Паттерны: базовые правила', PT + '1-2'],
  'p-screens': ['Паттерны: построение экранов', PT + '3-7'],
  'p-section': ['Паттерны: секция и её структура', PT + '3-4'],
  'p-radius': ['Паттерны: скругления', PT + '3-5'],
  'p-shadows': ['Паттерны: тени', PT + '5-28'],
  'p-spacing': ['Паттерны: отступы', PT + '5-27'],
  'p-typography': ['Паттерны: типографика', PT + '5-29'],
  'p-texts': ['Паттерны: тексты для бэка', PT + '1018-6775'],
  'p-feed': ['Паттерны: ритм товарной ленты', PT + '3-6'],
  'p-bottomsheet': ['Паттерны: боттомшиты', PT + '173-2191'],
  'p-loading': ['Паттерны: загрузка на экране', PT + '4-10'],
  'p-empty': ['Паттерны: пустые состояния', PT + '4-12'],
  'p-sticky': ['Паттерны: закрепления', PT + '4-11'],
  'p-select': ['Паттерны: выбор из списка', PT + '4-13'],
  'p-offline': ['Паттерны: отсутствие интернета', PT + '4-14'],
  'p-link': ['Паттерны: ссылка в тексте', PT + '4-15'],
  'p-lists': ['Паттерны: списки в тексте', PT + '4-16'],
  'p-access': ['Паттерны: доступность взаимодействия', PT + '4-17'],
  'p-placeholder': ['Паттерны: заглушка для картинок', PT + '649-5918'],
  'p-tap': ['Паттерны: нажатие на элемент', PT + '5-19'],
};
// =========================================================================

function link(g) {
  if (g && g.startsWith('c:')) return ['Страница компонента в Pole Mobile 2.0', PM + g.slice(2)];
  return LINKS[g] || LINKS.guide;
}
let FILE_KEY = null; try { FILE_KEY = figma.fileKey || null; } catch (e) {}
const nodeUrl = (id) => FILE_KEY ? `https://www.figma.com/design/${FILE_KEY}/?node-id=${encodeURIComponent(id.replace(/:/g, '-'))}` : null;
const IN = (n) => n % 10 === 1 && n % 100 !== 11 ? 'месте' : 'местах'; // «в 1 месте», «в 5 местах»
// Другие места с той же проблемой у того же элемента: одна пометка вместо пометки на каждой копии
function elsewhere(it) {
  const more = it.more || [];
  const lines = [];
  if (more.length) {
    const others = (it.n || 1) - 1;
    const parts = more.map(x => {
      const where = x.scr === it.scr ? 'на этом экране' : (nodeUrl(x.id) ? `[«${x.name}»](${nodeUrl(x.id)})` : `«${x.name}»`);
      return `${where} — ${x.n}`;
    });
    const listed = more.reduce((a, x) => a + x.n, 0);
    if (others > listed) parts.push(`и ещё ${others - listed} на других экранах`);
    lines.push(`**Этот же элемент ещё в ${others} ${IN(others)} — поправь ${others === 1 ? 'и его' : 'и их'}:** ${parts.join('; ')}`);
  }
  if (it.similar) lines.push(`_Та же проблема ещё в ${it.similar} ${IN(it.similar)} у других элементов — без отдельной пометки._`);
  return lines;
}
// «Что не так» и «Как исправить» — списками, блоки — отдельными абзацами
const bullets = (arr) => arr.map(x => `- ${x.trim().replace(/[.;]$/, '')}`).join('\n');
function problem(m) {
  // «X закастомлен: тени (…); цвет (…)» / «X собран не только из 🍏. Внутри: a; b» → заголовок + список
  const mm = m.match(/^(.*?)(?::|\. Внутри:)\s+(.+;.+)$/s);
  return mm ? `**Что не так:** ${mm[1]}:\n${bullets(mm[2].split(/;\s+/))}` : `**Что не так:** ${m}`;
}
function fixes(fx) {
  const items = fx.includes('\n') ? fx.split('\n') : fx.split(/(?<=[.!])\s+(?=[А-ЯЁA-Z«🍏])/);
  const list = items.map(x => x.trim()).filter(Boolean);
  if (list.length < 2) return `**Как исправить:** ${fx}`;
  const head = /:$/.test(list[0]) ? `**Как исправить:** ${list.shift()}` : '**Как исправить:**';
  return `${head}\n${bullets(list)}`;
}
function markdown(it) {
  const [title, url] = link(it.g);
  return [
    `**DS Review · ${SEV[it.s] || SEV.E}**`,
    problem(it.m),
    fixes(it.fx),
    ...elsewhere(it),
    `**Гайд:** [${title}](${url})`,
  ].join('\n\n');
}

const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root) return { error: `Узел ${ROOT_ID} не найден` };
let page = root; while (page && page.type !== 'PAGE') page = page.parent;
await figma.setCurrentPageAsync(page);

let cat = null;
try { cat = (await figma.annotations.getAnnotationCategoriesAsync()).find(c => c.label === CATEGORY.label) || null; } catch (e) {}
const isOurs = (a) => (cat && a.categoryId === cat.id) || /^\*\*DS Review/.test(a.labelMarkdown || '') || /^DS Review/.test(a.label || '');

// 1. Найти старые пометки DS Review внутри ROOT
const annotated = [root, ...root.findAll(n => 'annotations' in n && n.annotations && n.annotations.length > 0)]
  .filter(n => 'annotations' in n && n.annotations && n.annotations.some(isOurs));

// 2. Разложить новые пометки по слоям
const plan = new Map(); const missing = [];
for (const it of ITEMS) {
  for (const id of it.ids || []) {
    let node = await figma.getNodeByIdAsync(id);
    let hops = 0;
    while (node && !('annotations' in node) && hops < 5) { node = node.parent; hops++; }
    if (!node || node.type === 'PAGE') { missing.push(id); continue; }
    if (!plan.has(node.id)) plan.set(node.id, { node, md: [] });
    plan.get(node.id).md.push(markdown(it));
  }
}

if (MODE === 'dry') {
  return { mode: MODE, wouldClear: annotated.length, wouldAnnotateNodes: plan.size, missing,
    sample: [...plan.values()].slice(0, 3).map(p => ({ id: p.node.id, name: p.node.name, md: p.md[0] })),
    sampleMore: [...plan.values()].flatMap(p => p.md.filter(m => m.includes('Этот же элемент')).map(md => ({ id: p.node.id, name: p.node.name, md }))).slice(0, 2) };
}

// 3. Убрать старые пометки DS Review (чужие аннотации остаются)
let cleared = 0; const failed = [];
for (const n of MODE === 'append' ? [] : annotated) {
  try { const keep = n.annotations.filter(a => !isOurs(a)); cleared += n.annotations.length - keep.length; n.annotations = keep; }
  catch (e) { failed.push({ id: n.id, error: String(e.message || e) }); }
}
if (MODE === 'clear') return { mode: MODE, cleared, failed };

// 4. Категория DS Review
if (!cat) { try { cat = await figma.annotations.addAnnotationCategoryAsync(CATEGORY); } catch (e) { cat = null; } }

// 5. Записать новые пометки
let written = 0;
for (const { node, md } of plan.values()) {
  const extra = md.map(labelMarkdown => (cat ? { labelMarkdown, categoryId: cat.id } : { labelMarkdown }));
  try { node.annotations = [...node.annotations, ...extra]; written += extra.length; }
  catch (e) {
    // Некоторые слои не принимают аннотации — пробуем родителя
    let p = node.parent, ok = false;
    while (p && p.type !== 'PAGE' && !ok) {
      try { if ('annotations' in p) { p.annotations = [...p.annotations, ...extra]; written += extra.length; ok = true; } } catch (er) {}
      p = p.parent;
    }
    if (!ok) failed.push({ id: node.id, error: String(e.message || e) });
  }
}
return { mode: MODE, cleared, written, nodes: plan.size, missing, failed, category: cat ? cat.label : null };
