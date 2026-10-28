#!/usr/bin/env sh
# Проверка синтаксиса скриптов навыка. Скрипты используют top-level await и return
# (так их исполняет use_figma), поэтому перед проверкой оборачиваем их в async-функцию.
set -e
cd "$(dirname "$0")/.."
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
status=0
for f in ds-review/scripts/*.js; do
  out="$TMP/$(basename "$f")"
  { echo "(async () => {"; cat "$f"; echo "})();"; } > "$out"
  if node --check "$out"; then
    size=$(wc -m < "$f")
    echo "OK  $f ($size символов)"
    # use_figma принимает код до 50 000 символов. audit.js и outline.js уходят почти как есть (подставляется только ROOT_ID),
    # annotate.js дополняется пунктами ITEMS — ему нужен запас ~30 000 символов.
    case "$f" in *annotate.js) limit=20000 ;; *) limit=47000 ;; esac
    if [ "$size" -gt "$limit" ]; then echo "ERR $f: больше $limit символов — use_figma не примет код с запасом"; status=1; fi
  else
    echo "ERR $f"; status=1
  fi
done
# Автотест правил на заглушке Figma API
node tests/mock-audit.mjs ds-review/scripts/audit.js || status=1
# Frontmatter навыка
head -n 1 ds-review/SKILL.md | grep -q '^---$' || { echo "ERR SKILL.md: нет frontmatter"; status=1; }
grep -q '^name: ds-review$' ds-review/SKILL.md || { echo "ERR SKILL.md: нет name"; status=1; }
exit $status
