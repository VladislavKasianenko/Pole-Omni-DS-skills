#!/usr/bin/env sh
# Проверка навыка: исходники, сборка, размер, автотесты, frontmatter. Запускается локально и в CI.
set -e
cd "$(dirname "$0")/.."
[ -d node_modules/terser ] || npm i --silent --no-audit --no-fund >/dev/null
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
status=0
# 1. Синтаксис исходников и собранных скриптов (top-level await и return — как в use_figma)
for f in src/*.js ds-review/scripts/*.js; do
  out="$TMP/$(echo "$f" | tr '/' '_')"
  { echo "(async () => {"; cat "$f"; echo "})();"; } > "$out"
  if node --check "$out"; then :; else echo "ERR синтаксис: $f"; status=1; fi
done
# 2. Собранные скрипты совпадают с src/
node tools/build.mjs --check || status=1
# 3. Размер: use_figma принимает до 50 000 символов. annotate.js дополняется пунктами ITEMS — ему нужен запас.
for f in ds-review/scripts/*.js; do
  size=$(wc -m < "$f")
  case "$f" in *annotate.js) limit=20000 ;; *) limit=47000 ;; esac
  if [ "$size" -gt "$limit" ]; then echo "ERR $f: $size символов, лимит $limit"; status=1; else echo "OK  $f ($size символов)"; fi
done
# 4. Автотесты на заглушке Figma API: правила (src/audit.js) и собранный review.js
node tests/mock-audit.mjs src/audit.js || status=1
node tests/mock-review.mjs || status=1
# 5. Frontmatter навыка
head -n 1 ds-review/SKILL.md | grep -q '^---$' || { echo "ERR SKILL.md: нет frontmatter"; status=1; }
grep -q '^name: ds-review$' ds-review/SKILL.md || { echo "ERR SKILL.md: нет name"; status=1; }
exit $status
