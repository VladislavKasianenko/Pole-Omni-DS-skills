// Автотест audit.js на заглушке Figma API: каждое правило должно сработать там, где ожидается.
// Запуск: node tests/mock-audit.mjs ds-review/scripts/audit.js
import fs from 'node:fs';
const SRC = fs.readFileSync(process.argv[2], 'utf8');
const run = async (rootId) => { const fn = new (Object.getPrototypeOf(async function () {}).constructor)(SRC.replace("'__NODE_ID__'", `'${rootId}'`)); return fn(); };
let idc = 100;
const vars = { v1: { name: '🍏 surface/primary/default', variableCollectionId: 'c1' }, v2: { name: 'corner/28', variableCollectionId: 'c2' }, v3: { name: '🔴 surface/muted/default', variableCollectionId: 'c1' }, v4: { name: 'neutral/gray/800', variableCollectionId: 'c3' }, v5: { name: '🍏 global/background/primary', variableCollectionId: 'c1' } };
const cols = { c1: { name: 'theme pack 1' }, c2: { name: 'radius' }, c3: { name: 'color' } };
const styles = { s1: { name: '🍏 Body/Large/Loose' }, s2: { name: '🔴 Body/Large/Accent' } };
const comps = {};
function node(type, name, props = {}, children) {
  const n = { id: props.id || `${idc++}:1`, type, name, visible: true, width: 360, height: 100, fills: [], strokes: [], effects: [], boundVariables: {}, cornerRadius: 0, ...props };
  if (children) { n.children = children; children.forEach(c => c.parent = n); }
  n.findAllWithCriteria = ({ types }) => { const out = []; const walk = x => { (x.children || []).forEach(c => { if (types.includes(c.type)) out.push(c); walk(c); }); }; walk(n); return out; };
  n.findAll = (fn) => { const out = []; const walk = x => { (x.children || []).forEach(c => { if (fn(c)) out.push(c); walk(c); }); }; walk(n); return out; };
  return n;
}
function comp(name, key, remote = true, setName) { const c = { id: 'c-' + key, name, key, remote, type: 'COMPONENT' }; if (setName) c.parent = { type: 'COMPONENT_SET', name: setName, key: key + 's' }; return c; }
function inst(mc, props = {}, children) { const n = node('INSTANCE', mc.parent ? mc.parent.name : mc.name, props, children); n.getMainComponentAsync = async () => mc; n.overrides = props.overrides || []; return n; }
const solid = (r, g, b, bound) => ({ type: 'SOLID', color: { r, g, b }, visible: true, ...(bound ? { boundVariables: { color: { id: bound } } } : {}) });
const txt = (chars, style = 's1') => node('TEXT', chars, { characters: chars, textStyleId: style, fills: [solid(0, 0, 0, 'v1')], width: 50, height: 20 });
// Экран
const btnBack = inst(comp('State=Default', 'kb', true, '🍏 Button / Base / Primary'), { width: 300, height: 48 }, [txt('Назад')]);
const illu = inst(comp('Base illustration / 112 / Error', 'ki'), { width: 112, height: 112 });
const empty = inst(comp('Type=Default', 'ke', true, '🍏 Empty State'), { width: 328, height: 300 }, [illu, btnBack]);
const sheetHeader = inst(comp('Type=1', 'kh', true, '🍏 Bottomsheet Header'), { width: 360, height: 60 });
const sheet = node('FRAME', 'bottomsheet', { layoutMode: 'VERTICAL', itemSpacing: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, fills: [solid(1, 1, 1)] }, [sheetHeader, txt('Пункт', 's2')]);
const sec1 = node('FRAME', 'sec1', { fills: [solid(1, 1, 1, 'v1')], cornerRadius: 28, topLeftRadius: 28, topRightRadius: 28, bottomLeftRadius: 28, bottomRightRadius: 28, boundVariables: { topLeftRadius: { id: 'v2' }, topRightRadius: { id: 'v2' }, bottomLeftRadius: { id: 'v2' }, bottomRightRadius: { id: 'v2' } }, layoutMode: 'VERTICAL', itemSpacing: 12, paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 }, [empty]);
const sec2 = node('FRAME', 'sec2', { fills: [solid(1, 1, 1, 'v3')], cornerRadius: 28, topLeftRadius: 28, topRightRadius: 28, bottomLeftRadius: 28, bottomRightRadius: 28, layoutMode: 'VERTICAL', itemSpacing: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }, [txt('Без стиля', '')]);
const vec1 = node('VECTOR', 'Star', { width: 10, height: 10, fills: [solid(1, 0.8, 0.6)] });
const vec2 = node('VECTOR', 'Vector', { width: 20, height: 20, fills: [solid(0.5, 0.5, 0.5, 'v4')] });
const iconHand = node('FRAME', 'скидки', { width: 48, height: 48, layoutMode: 'NONE' }, [vec1, vec2, txt('%')]);
const logo = node('FRAME', 'Base / 40 / Logo / Main / Colored', { width: 40, height: 40 }, [node('VECTOR', 'v', { width: 30, height: 10, fills: [solid(1, 0, 0)] })]);
const lemon = inst(comp('🍋 Search [ver 1.0]', 'kl'), { width: 360, height: 50 });
const web = inst(comp('Type=1', 'kw', true, '🏀 Empty State'), { width: 300, height: 200 }, [inst(comp('S', 'kwb', true, '🏀 Buttons / Base / Primary'), { width: 300, height: 48 }, [txt('Закрыть')])]);
const btns = node('FRAME', 'buttons', { layoutMode: 'VERTICAL', itemSpacing: 12, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, width: 328 }, [inst(comp('S', 'ks', true, '🍏 Button / Base / Secondary'), { width: 328, height: 48 }, [txt('Понятно')]), inst(comp('S', 'kp2', true, '🍏 Button / Base / Primary'), { width: 328, height: 48 }, [txt('Оформить')])]);
const inline = inst(comp('S', 'kin', true, '🍏 Inline button / Base / Primary'), { width: 80, height: 28 }, [txt('Изменить')]);
// Секция промокодов: заливка на токене фона экрана, отступы 12/16 и 8 между заголовком и контентом
const promoSec = node('FRAME', 'Promo Code Widget', { fills: [solid(0.95, 0.95, 0.95, 'v5')], cornerRadius: 28, layoutMode: 'VERTICAL', itemSpacing: 8, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 }, [inst(comp('S', 'ktitle', true, '🍏 Title'), { width: 328, height: 24 }), txt('Промокоды')]);
// Шапка во всю ширину: отступ только сверху (под статус-бар) — отступы не проверяем
const headSec = node('FRAME', 'Head', { fills: [solid(1, 1, 1, 'v1')], layoutMode: 'VERTICAL', itemSpacing: 0, paddingTop: 32, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }, [txt('Шапка')]);
const container = node('FRAME', 'Group Section', { layoutMode: 'VERTICAL', itemSpacing: 4, paddingTop: 0, paddingBottom: 0, width: 360 }, [headSec, sec1, sec2, promoSec]);
const screen = node('FRAME', 'Экран', { id: '1:1', fills: [solid(0.9, 0.9, 0.9, 'v1')], effects: [{ type: 'DROP_SHADOW', visible: true }], effectStyleId: 'sx', height: 800 }, [container, sheet, iconHand, logo, lemon, web, btns, inline]);
const page = { type: 'PAGE', name: 'Page', children: [screen] }; screen.parent = page;
const all = {}; const idx = x => { all[x.id] = x; (x.children || []).forEach(idx); }; idx(screen);
globalThis.figma = {
  mixed: Symbol('mixed'),
  getNodeByIdAsync: async id => all[id] || null,
  setCurrentPageAsync: async () => {},
  getStyleByIdAsync: async id => styles[id] || (id === 'sx' ? { name: 'Display' } : null),
  variables: { getVariableByIdAsync: async id => vars[id] || null, getVariableCollectionByIdAsync: async id => cols[id] || null },
};
const res = await run('1:1');
const rules = new Set(Object.keys(res.byRule).map(k => k.split(' ')[1]));
const expected = ['section-fill', 'section-padding', 'container-spacing', 'container-radius', 'deprecated-token', 'no-text-style', 'hex', 'manual-bottomsheet', 'deprecated-style', 'primitive', 'icon-hex', 'detached', 'web-component', 'secondary-primary', 'button-order', 'multi-primary', 'illustration-meaning'];
const missing = expected.filter(r => !rules.has(r));
const errors = [];
if (missing.length) errors.push('Не сработали правила: ' + missing.join(', '));
if (res.skipped.platform !== 1) errors.push('Компонент 🍋 должен быть пропущен');
if (res.groups.some(g => g.ids.includes('1:1') && g.r === 'deprecated-style')) errors.push('Тень-подложка экрана не должна помечаться');
if (res.groups.some(g => /Inline/.test(g.m))) errors.push('Inline button не должен считаться Primary');
if (res.groups.filter(g => g.r === 'icon-hex').length !== 1) errors.push('Самодельная иконка — ровно одна пометка icon-hex');

// Флоу из двух экранов: локальный компонент «Card» — по 3 копии на каждом экране,
// поле ввода со скруглением без токена — по одному на экране. Ждём по одной пометке на элемент.
const card = comp('Card', 'kcard', false);
const promo = comp('Promo', 'kpromo', false);
const field = () => node('FRAME', 'Input', { width: 328, height: 56, cornerRadius: 28, topLeftRadius: 28, topRightRadius: 28, bottomLeftRadius: 28, bottomRightRadius: 28, fills: [solid(1, 1, 1, 'v1')] }, [txt('Введите промокод')]);
// Карточка команды: таймер — самодельный лейбл, условие — самодельная строка списка, кнопка — 🍏 Button, текст со старым стилем
const cardKids = () => [
  node('FRAME', 'Frame 12', { layoutMode: 'HORIZONTAL', width: 90, height: 28, cornerRadius: 14, fills: [solid(1, 0.88, 0.7, 'v1')] }, [txt('00:29:45'), node('VECTOR', 'clock', { width: 16, height: 16, fills: [solid(1, 0.3, 0, 'v1')] })]),
  node('FRAME', 'Condition', { layoutMode: 'HORIZONTAL', width: 300, height: 56 }, [node('VECTOR', 'minus', { width: 24, height: 24, fills: [solid(0.8, 0.8, 0.8, 'v1')] }), node('FRAME', 'Texts', { layoutMode: 'VERTICAL', width: 240, height: 48 }, [txt('Добавьте два сыра'), txt('Осталось добавить один')])]),
  inst(comp('S', 'kbtn2', true, '🍏 Button / Base / Secondary'), { width: 300, height: 48 }, [txt('Применить')]),
  txt('Скрыть', 's2'),
  inst(comp('Timer badge', 'ktimer', false), { width: 80, height: 20 }, [txt('Выгодно', '')]),
];
const flowScreen = (id, name, extra = []) => node('FRAME', name, { id, height: 800, fills: [solid(0.9, 0.9, 0.9, 'v1')] }, [inst(card, { width: 328, height: 156 }, cardKids()), inst(card, { width: 328, height: 156 }, cardKids()), inst(card, { width: 328, height: 156 }, cardKids()), field(), ...extra]);
// Promo — компонент команды, собранный из 🍏 целиком: пометки быть не должно
const scrA = flowScreen('2:2', 'Галерея промокодов', [inst(promo, { width: 328, height: 100 }, [inst(comp('S', 'kbtn3', true, '🍏 Button / Base / Primary'), { width: 300, height: 48 }, [txt('Перейти')])])]);
// Тост: цвет «переопределён», но совпадает с мастером — не кастомизация; у второго тоста цвет другой — кастомизация
const toastMc = { ...comp('S', 'ktoast', true, '🍏 Toast'), fills: [solid(0.3, 0.3, 0.3, 'v1')] };
const toast = (id, fills) => inst(toastMc, { id, width: 328, height: 48, fills, overrides: [{ id, overriddenFields: ['fills'] }] });
// Список условий: 2 строки с шевроном в столбике — самодельный список вместо 🍏 List
const listRow = (t) => node('FRAME', 'Row', { layoutMode: 'HORIZONTAL', width: 328, height: 56 }, [node('FRAME', 'Texts', { layoutMode: 'VERTICAL', width: 280, height: 40 }, [txt(t), txt('Подпись')]), node('VECTOR', 'chevron', { width: 24, height: 24, fills: [solid(0.5, 0.5, 0.5, 'v1')] })]);
const conditions = inst(comp('S', 'kcond', false, 'Conditions'), { width: 328, height: 120 }, [node('FRAME', 'List', { layoutMode: 'VERTICAL', width: 328, height: 112 }, [listRow('Первое'), listRow('Второе')])]);
// 🍔 — компонент команды (не устаревший), 🔴 — устаревший из Pole Mobile 1.0
// внутри — сложная картинка (векторы крупнее 48 px с hex): hex в картинке допустим
// и фото блюда с градиентным затемнением поверх — часть картинки
const gradFill = { type: 'GRADIENT_LINEAR', visible: true, gradientStops: [] };
const dish = inst(comp('Dish', 'kdish', false), { width: 154, height: 154, fills: [{ type: 'IMAGE', visible: true }] }, [node('RECTANGLE', 'Shadow Top', { width: 154, height: 45, fills: [gradFill] }), txt('Блюдо')]);
const burger = inst(comp('S', 'kburger', true, '🍔 Restaurant Card'), { width: 328, height: 200 }, [txt('Ресторан'), dish, node('GROUP', 'Picture', { width: 120, height: 120 }, [node('VECTOR', 'p1', { width: 120, height: 80, fills: [solid(0.9, 0.2, 0.1)] }), node('VECTOR', 'p2', { width: 100, height: 60, fills: [solid(0.1, 0.6, 0.2)] })])]);
const oldTitle = inst(comp('S', 'kold', true, '🔴 Title'), { width: 328, height: 40 }, [txt('Заголовок')]);
// 🍏 Tabs: иконку заменили, её цвет числится переопределённым — на 🍏 токене это не кастомизация, на hex — кастомизация
const tabsMc = comp('S', 'ktabs', true, '🍏 Tabs Segmented');
const tabs = (id, fill) => { const v = node('VECTOR', 'Icon', { id: id + '1', width: 20, height: 20, fills: [fill] }); const ic = inst(comp('Base / 24 / Outline / Bike', 'kbike' + id), { width: 24, height: 24 }, [v]); return inst(tabsMc, { id, width: 360, height: 40, overrides: [{ id: v.id, overriddenFields: ['fills'] }] }, [ic]); };
// Шапка: блоки склеены (gap 0), скруглён только низ последнего — это одна секция, а не контейнер секций
const header = node('FRAME', 'Header', { layoutMode: 'VERTICAL', itemSpacing: 0, width: 360, height: 200 }, [node('FRAME', 'Tabs', { width: 360, height: 40, fills: [solid(1, 1, 1, 'v1')] }, [txt('Доставка')]), node('FRAME', 'Address', { width: 360, height: 32, fills: [solid(1, 1, 1, 'v1')] }, [txt('Адрес')]), node('FRAME', 'Search', { width: 360, height: 72, topLeftRadius: 0, topRightRadius: 0, bottomLeftRadius: 28, bottomRightRadius: 28, boundVariables: { bottomLeftRadius: { id: 'v2' }, bottomRightRadius: { id: 'v2' } } }, [txt('Поиск')])]);
const scrB = flowScreen('2:3', 'Промокод выбран', [header, conditions, burger, oldTitle, tabs('4:1', solid(1, 0, 0, 'v1')), tabs('4:2', solid(1, 0, 0)), toast('3:1', [solid(0.3, 0.3, 0.3, 'v1')]), toast('3:2', [solid(1, 0, 0, 'v1')])]);
const flow = node('SECTION', 'Промокоды', { id: '2:1', width: 2000, height: 1000 }, [scrA, scrB]);
flow.parent = page; idx(flow);
const res2 = await run('2:1');
const cardG = res2.groups.filter(g => g.r === 'product-component' && /Card/.test(g.m));
if (cardG.length !== 1) errors.push(`«Card» в 6 местах — ждём 1 пометку, получили ${cardG.length}`);
else {
  const g = cardG[0];
  if (g.ids.length !== 1 || g.n !== 6) errors.push(`«Card»: ждём ids из 1 слоя и n = 6, получили ids ${g.ids.length}, n ${g.n}`);
  const m = g.more || [];
  if (m.length !== 2 || m[0].scr !== '2:2' || m[0].n !== 2 || m[1].scr !== '2:3' || m[1].n !== 3) errors.push('«Card»: в more ждём «этот экран — 2» и «Промокод выбран — 3»');
  for (const [re, what] of [[/«00:29:45».*лейбл/, 'таймер — самодельный лейбл'], [/«Скрыть».*🔴 Body/, 'текст со старым стилем'], [/«Timer badge» → «Выгодно» — текст без стиля/, 'вложенный компонент команды стрелкой']]) if (!re.test(g.m)) errors.push(`«Card»: в пометке нет «${what}»`);
  if (/Применить/.test(g.m)) errors.push('«Card»: 🍏 Button внутри не должна попадать в пометку');
  if (/строка списка/.test(g.m)) errors.push('«Card»: одиночная строка в карточке — не список');
  if (g.s !== 'E') errors.push('«Card»: старый стиль внутри — критичность E');
}
const toastG = res2.groups.filter(g => g.r === 'customized' && /Toast/.test(g.m));
if (toastG.length !== 1 || toastG[0].ids[0] !== '3:2') errors.push('Тост с цветом как у мастера — не кастомизация; с другим цветом — кастомизация');
if (!res2.groups.some(g => g.r === 'product-component' && /Conditions/.test(g.m) && /строка списка/.test(g.m))) errors.push('Две строки с шевроном в столбике — самодельный список');
if (res2.groups.some(g => g.r === 'container-spacing' && g.ids.some(id => all[id] && all[id].name === 'Header'))) errors.push('Шапка из склеенных блоков — не контейнер с секциями');
if (res2.groups.some(g => /Restaurant/.test(g.m))) errors.push('🍔 Restaurant Card — компонент команды, не устаревший');
if (!res2.groups.some(g => g.r === 'deprecated-component' && /🔴 Title/.test(g.m))) errors.push('🔴 Title — устаревший компонент');
const tabsG = res2.groups.filter(g => g.r === 'customized' && /Tabs/.test(g.m));
if (tabsG.length !== 1 || tabsG[0].ids[0] !== '4:2') errors.push('Цвет заменённой иконки на 🍏 токене — не кастомизация; hex — кастомизация');
if (res2.groups.some(g => /Promo/.test(g.m))) errors.push('Компонент команды, собранный из 🍏, не помечается');
if (!(res2.skipped.product >= 1)) errors.push('Чистый компонент команды — в skipped.product');
if (res2.groups.some(g => g.r === 'multi-primary')) errors.push('Кнопки внутри компонентов команды не считаются Primary экрана');
const fieldG = res2.groups.filter(g => g.ids.some(id => all[id] && all[id].name === 'Input'));
if (fieldG.length && fieldG.some(g => !(g.more && g.more.length))) errors.push('Поле ввода на двух экранах — одна пометка со ссылкой на второй экран');

if (res.groups.some(g => g.r === 'section-padding' && g.ids.includes(headSec.id))) errors.push('Шапка во всю ширину — отступы не проверяем');
if (res.groups.some(g => g.r === 'section-padding' && g.ids.includes(sec1.id))) errors.push('Секция с отступами 16 и 12 — по паттерну');
const pp = res.groups.find(g => g.r === 'section-padding' && g.ids.includes(promoSec.id));
if (!pp || !/между заголовком и контентом 8/.test(pp.m)) errors.push('Секция промокодов: ждём отступы 12/16 и 8 между заголовком и контентом');
if (errors.length) { console.error('FAIL\n' + errors.join('\n')); process.exit(1); }
console.log(`OK  tests/mock-audit.mjs: ${res.totals.groups} групп, правил: ${rules.size}; повторы: «Card» ×6 → 1 пометка; состав компонента команды проверяется`);
