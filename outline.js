// DS Review · outline.js — ТОЛЬКО ЧТЕНИЕ. Компактная структура экранов для проверки паттернов.
// Запуск: передать весь текст в use_figma как `code`, подставив ROOT_ID (экран или секция)
// и OFFSET (с какого экрана начать, если экранов больше LIMIT).
const ROOT_ID = '__NODE_ID__';
const OFFSET = 0;
const LIMIT = 8;           // экранов за один вызов
const MAX_DEPTH = 6;
const MAX_LINES = 140;     // строк на экран

const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root) return { error: `Узел ${ROOT_ID} не найден` };
let page = root; while (page && page.type !== 'PAGE') page = page.parent;
await figma.setCurrentPageAsync(page);

let screens = [];
if (root.type === 'SECTION' || root.type === 'PAGE') {
  const q = [...root.children];
  while (q.length) {
    const c = q.shift();
    if (c.visible === false) continue;
    if (c.type === 'SECTION') q.push(...c.children);
    else if (c.type === 'FRAME' && c.width >= 300 && c.width <= 480) screens.push(c);
  }
} else screens = [root];
const total = screens.length;
screens = screens.slice(OFFSET, OFFSET + LIMIT);

const vc = new Map();
async function vn(id) { if (vc.has(id)) return vc.get(id); let v = null; try { v = await figma.variables.getVariableByIdAsync(id); } catch (e) {} const n = v ? v.name : '?'; vc.set(id, n); return n; }
const sc = new Map();
async function sn(id) { if (!id || typeof id !== 'string') return null; if (sc.has(id)) return sc.get(id); let s = null; try { s = await figma.getStyleByIdAsync(id); } catch (e) {} const n = s ? s.name : '?'; sc.set(id, n); return n; }

async function line(n) {
  const r = (x) => Math.round(x);
  let s = `${n.type[0]}${n.type.slice(1, 4).toLowerCase()} "${(n.name || '').slice(0, 40)}" [${n.id}] ${r(n.width)}×${r(n.height)}`;
  if (n.type === 'INSTANCE') {
    const mc = await n.getMainComponentAsync();
    const set = mc && mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : null;
    s += ` ⇒ ${set ? set.name : mc ? mc.name : '?'}`;
    if (n.componentProperties) {
      const props = Object.entries(n.componentProperties).filter(([, v]) => v.type === 'VARIANT' || v.type === 'BOOLEAN').slice(0, 5).map(([k, v]) => `${k.split('#')[0]}=${v.value}`);
      if (props.length) s += ` {${props.join(', ')}}`;
    }
    for (const x of n.findAllWithCriteria({ types: ['INSTANCE'] }).slice(0, 40)) {
      const m = await x.getMainComponentAsync();
      if (m && /illustration\s*\/\s*\d+/i.test(m.name)) { s += ` illu="${m.name}"`; break; }
    }
    const texts = n.findAllWithCriteria ? n.findAllWithCriteria({ types: ['TEXT'] }).filter(t => t.visible).slice(0, 2).map(t => t.characters.replace(/\s+/g, ' ').slice(0, 30)) : [];
    if (texts.length) s += ` "${texts.join(' | ')}"`;
    return s;
  }
  if (Array.isArray(n.fills)) {
    const f = n.fills.find(p => p.visible !== false);
    if (f) s += f.type === 'SOLID' ? ` fill=${f.boundVariables && f.boundVariables.color ? await vn(f.boundVariables.color.id) : 'hex'}` : ` fill=${f.type.toLowerCase()}`;
  }
  if (typeof n.cornerRadius === 'number' && n.cornerRadius > 0) s += ` r=${n.cornerRadius}`;
  if (n.effects && n.effects.some(e => e.visible !== false)) s += ` fx=${(await sn(n.effectStyleId)) || 'manual'}`;
  if (n.type === 'FRAME' && n.layoutMode && n.layoutMode !== 'NONE') s += ` AL:${n.layoutMode[0]} gap=${n.itemSpacing} pad=${n.paddingTop}/${n.paddingRight}/${n.paddingBottom}/${n.paddingLeft}`;
  if (n.layoutPositioning === 'ABSOLUTE') s += ' abs';
  if (n.type === 'TEXT') s += ` style=${(await sn(n.textStyleId)) || 'none'} "${n.characters.replace(/\s+/g, ' ').slice(0, 50)}"`;
  return s;
}

const out = [];
for (const scr of screens) {
  const lines = [];
  async function walk(n, d) {
    if (lines.length >= MAX_LINES || n.visible === false) return;
    lines.push('  '.repeat(d) + await line(n));
    if (n.type === 'INSTANCE' || d >= MAX_DEPTH || !('children' in n)) return;
    for (const c of n.children) await walk(c, d + 1);
  }
  await walk(scr, 0);
  out.push({ id: scr.id, name: scr.name, size: `${Math.round(scr.width)}×${Math.round(scr.height)}`, truncated: lines.length >= MAX_LINES, outline: lines.join('\n') });
}
return { total, offset: OFFSET, next: OFFSET + LIMIT < total ? OFFSET + LIMIT : null, screens: out };
