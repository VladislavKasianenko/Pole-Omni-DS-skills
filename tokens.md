# Токены Pole Mobile 2.0

Источник: файл [🍏 Pole Mobile 2.0](https://www.figma.com/design/tN0vhB9QeckIvUKC6T8zWb/Pole-Mobile-2.0?node-id=56968-35493). Названия токенов пишутся со строчной буквы, слова через пробел (`🍏 imaged selector/…`).

## Цвета

**Коллекция `theme pack 1`** — семантические токены, все с префиксом 🍏. Десять тем брендов (Omni, Market, Cosmetic, Dark Store, Zaryad, RTE, Apteka, C2C, V1, Omni Old), все светлые. Тема переключается модом на файл или фрейм, компоненты перекрашиваются сами. Тёмной темы пока нет — не проверяем.

| Группа | Для чего |
|---|---|
| `🍏 text/…` | Текст: primary, secondary, tertiary, invert, accent, link, static, premium |
| `🍏 surface/…` | Подложки: primary (секции), muted (плитки внутри секции), intense, subdued, transparent |
| `🍏 global/background/…` | Фон экрана: secondary — экран с секциями, primary — подложка заглушек картинок |
| `🍏 icon/…` | Иконки: primary, secondary, tertiary, muted, invert, project |
| `🍏 border/…`, `🍏 divider/…` | Обводки и разделители |
| `🍏 system/…` | success, warning, error, bright, rating |
| `🍏 project/…` | Цвета направлений (core, cosmetic, apteka, market…) |
| `🍏 <компонент>/…` | Контекстные токены компонентов: button, chips, field, label, status, toast, overlay, skeleton… |
| `🍏 shadow/…` | Цвета теней |

Правила:
- В макете только 🍏 семантические токены.
- **Примитивы палитры напрямую — ошибка.** Палитра — библиотека **Pallete**, коллекция `color`: `neutral/gray/…`, `neutral/white alpha/…`, `brand/…`, `brand alpha/…`, `system/…`, `system alpha/…`, `other/…`, `base/white`, `payment/…`, `social/…`.
- Токены с 🔴, 🔥 и другими эмодзи — устаревшие. Замена — 🍏 токен, обычно с тем же названием.
- Hex допустим только внутри сложных картинок (векторные иллюстрации, фото, баннеры-картинки). Интерфейсные слои — только токены.
- Токен ставится по назначению: `surface` — на подложку, `text` — на текст, `icon` — на иконку.
- Градиенты — стили `🍏 gradient/format/…`, `🍏 gradient/loyalty/…`, `🍏 gradient/payment/…`.

Гайд: [Токены цвета](https://www.figma.com/design/tN0vhB9QeckIvUKC6T8zWb/Pole-Mobile-2.0?node-id=2-26).

## Отступы

**margins** — базовая шкала (scope: Gap):

| xxs | xs | s | m | l | xl | 2xl | 3xl | 4xl |
|---|---|---|---|---|---|---|---|---|
| 2 | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 |

**spacing** — для каркаса страницы:

| Токен | Значение | Где |
|---|---|---|
| `page/padding` | → xs (4) | Верхний и нижний отступ контейнера с секциями |
| `page/margin` | → xs (4) | Gap между секциями |
| `box/padding` | → m (12) | Врезка: сверху и снизу |
| `box/padding-horizontal` | → l (16) | Врезка: по бокам |

Гайд: [Spacing](https://www.figma.com/design/tN0vhB9QeckIvUKC6T8zWb/Pole-Mobile-2.0?node-id=83317-9857).

## Скругления

**radius**:

| Токен | Значение | Где |
|---|---|---|
| `container/section` | → corner/28 | Секции |
| `container/block` | → corner/20 | Блоки (контейнеры с контентом) |
| `container/card` | → corner/12 | Карточки и плитки |
| `corner/2 … corner/28` | 2, 4, 8, 12, 16, 20, 24, 28 | Прочие элементы. Средние компоненты — 12, маленькие — 8 |
| `corner/round` | 999 | Полное скругление: лейблы, аватары. Обязательно токеном, иначе на iOS скругление ломается |

Гайд: [Паттерны: скругления](https://www.figma.com/design/XgGTUV55rY4ni69XnFYXVJ/Patterns-Magnit-app-2.0?node-id=3-5).

## Типографика

Шрифт — только Magnit Sans. Стили:

| Стиль | Размер / межстрочный | Начертание |
|---|---|---|
| 🍏 Title/Extra Large | 24/32 | Bold |
| 🍏 Title/Large | 20/24 | Bold |
| 🍏 Title/Medium | 18/22 | Bold |
| 🍏 Title/Small | 16/20 | Bold |
| 🍏 Title/Small Medium | 16/20 | Medium |
| 🍏 Body/Large/Tight | 14/16 | Medium |
| 🍏 Body/Large/Loose | 14/20 | Medium |
| 🍏 Body/Small/Tight | 12/14 | Medium |
| 🍏 Caption/Medium/Tight | 11/12 | Medium |

Paragraph spacing не используем: в коде его нет. Списки с длинным тире — отдельным компонентом.

Гайд: [Типографика](https://www.figma.com/design/tN0vhB9QeckIvUKC6T8zWb/Pole-Mobile-2.0?node-id=130-43537).

## Тени

| Стиль | Для чего |
|---|---|
| 🍏 S | Слабая тень с обводкой: небольшие объекты, Pressed у крупной карточки |
| 🍏 M | Небольшие компоненты, например кнопки |
| 🍏 ML | Surface-карточки среднего размера |
| 🍏 L | Крупные карточки, всплывающие элементы (toast, tooltip), элементы на карте, закреплённые кнопки корзины и «Наверх» |
| 🍏 XL | Модалки и окна предупреждений |
| 🍏 Bottom panel | Закреплённые нижние панели, неблокирующий bottom sheet |
| 🍏 Red / Pink / Blue / Green / Yellow | Цветное свечение под иконкой формата |
| Background blur | Размытие фона |

Гайд: [Тени](https://www.figma.com/design/tN0vhB9QeckIvUKC6T8zWb/Pole-Mobile-2.0?node-id=441-148502).

## Анимация (motion)

Анимации ревью не проверяет. Для справки — токены `duration/…`, `easing/…` (productive и expressive: standard, entrance, exit, bounce), `transform/…`, `timing/…`.
Гайд: [Анимация](https://www.figma.com/design/tN0vhB9QeckIvUKC6T8zWb/Pole-Mobile-2.0?node-id=90707-6259).
