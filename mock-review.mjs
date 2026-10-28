// Автотест собранного review.js: проверка и пометки за один вызов, на заглушке Figma API.
// Запуск: node tests/mock-review.mjs
import fs from 'node:fs';
const SRC = fs.readFileSync('ds-review/scripts/review.js', 'utf8');
const run = (mode) => {
  const code = SRC.replace("const ROOT_ID = '__NODE_ID__';", "const ROOT_ID = '1:1';").replace("const MODE = 'write';", `const MODE = '${mode}';`);
  return new (Object.getPrototypeOf(async function () {}).constructor)(code)();
};
let idc = 10;
const all = {};
function node(type, name, props = {}, children) {
  const n = { id: props.id || `${idc++}:1`, type, name, visible: true, width: 360, height: 100, fills: [], strokes: [], effects: [], boundVariables: {}, cornerRadius: 0, annotations: [], ...props };
  if (children) { n.children = children; children.forEach(c => c.parent = n); }
  n.findAllWithCriteria = ({ types }) => { const out = []; const w = x => (x.children || []).forEach(c => { if (types.includes(c.type)) out.push(c); w(c); }); w(n); return out; };
  n.findAll = (fn) => { const out = []; const w = x => (x.children || []).forEach(c => { if (fn(c)) out.push(c); w(c); }); w(n); return out; };
  all[n.id] = n; return n;
}
const solid = (r, g, b) => ({ type: 'SOLID', color: { r, g, b }, visible: true });
const txt = (c) => node('TEXT', c, { characters: c, textStyleId: '', fills: [solid(0, 0, 0)], width: 50, height: 20 });
const chevron = node('INSTANCE', 'Base / 20 / Outline / Right small corner', { width: 20, height: 20 });
chevron.getMainComponentAsync = async () => ({ id: 'c1', name: 'Base / 20 / Outline / Right small corner', key: 'k1', remote: true, type: 'COMPONENT' });
chevron.overrides = [];
const row = node('FRAME', 'Adress', { layoutMode: 'HORIZONTAL', width: 328, height: 24 }, [txt('Санкт-Петербург'), chevron]);
const banner = node('FRAME', 'Banner', { width: 328, height: 120, fills: [solid(1, 0.5, 0)], layoutMode: 'VERTICAL' }, [txt('Акция')]);
const screen = node('FRAME', 'Экран', { id: '1:1', height: 800, fills: [solid(0.9, 0.9, 0.9)] }, [row, banner]);
screen.parent = { type: 'PAGE', name: 'Page', children: [screen] };
const cats = [];
globalThis.figma = {
  mixed: Symbol('mixed'), fileKey: 'FILEKEY',
  getNodeByIdAsync: async id => all[id] || null,
  setCurrentPageAsync: async () => {},
  getStyleByIdAsync: async () => null,
  variables: { getVariableByIdAsync: async () => null, getVariableCollectionByIdAsync: async () => null },
  annotations: {
    getAnnotationCategoriesAsync: async () => cats,
    addAnnotationCategoryAsync: async (c) => { const x = { id: 'cat1', ...c }; cats.push(x); return x; },
  },
};
const errors = [];
const rep = await run('report');
if (!rep.engine || !/^ds-review /.test(rep.engine)) errors.push('В ответе нет engine');
if (rep.annotations) errors.push('report не должен ставить пометки');
if (Object.values(all).some(n => n.annotations.length)) errors.push('report изменил файл');
if (!rep.groups.some(g => g.r === 'ds-lookalike' && /Санкт-Петербург/.test(g.m))) errors.push('Строка с шевроном из фреймов — ds-lookalike (🍏 List)');
const res = await run('write');
const written = Object.values(all).flatMap(n => n.annotations);
if (!res.annotations || res.annotations.written !== res.groups.length) errors.push(`write: пометок ${res.annotations && res.annotations.written}, групп ${res.groups.length}`);
if (!written.every(a => /^\*\*DS Review · /.test(a.labelMarkdown) && a.categoryId === 'cat1')) errors.push('Пометки не в формате DS Review или без категории');
const again = await run('write');
if (Object.values(all).flatMap(n => n.annotations).length !== again.annotations.written) errors.push('Повторный write должен заменить пометки, а не дописать');
if (errors.length) { console.error('FAIL tests/mock-review.mjs\n' + errors.join('\n')); process.exit(1); }
console.log(`OK  tests/mock-review.mjs: ${res.engine}, групп ${res.groups.length}, пометок ${res.annotations.written}`);
