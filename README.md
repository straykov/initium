# Инитум
Шаблон помогает быстро начать вёрстку проекта.

Перед началом работы нужно установить зависимости:
```bash
npm install
```
Удобнее через [Yarn](https://yarnpkg.com) (здесь и далее идентичные команды — парами, выбирайте, что нравится больше):
```bash
yarn
```

## Режимы
Одноразовая сборка:
```bash
npm start
```
```bash
yarn start
```

Запуск живой сборки на локальном сервере:
```bash
npm run live
```
```bash
yarn live
```

Сборка без автоматической перезагрузки страниц:
```bash
npm run no-server
```
```bash
yarn no-server
```

Живая сборка на локальном сервере и туннель в интернет:
```bash
npm run external-world
```
```bash
yarn external-world
```

## Шаблонизация
Шаблоны собираются из папки `src/templates` с помощью [pug](https://pugjs.org). Составные части лежат в `src/components/**/*.pug`. Боевые файлы автоматически собираются в корне проекта.

## Стили
Верстаются в `src/components/layout.pcss`, компилируются в `public/assets/css/style.css`. Работает антикэш — к ссылкам на стили добавляется md5-хэш.

#### PostCSS
Переменные ([precss](https://github.com/jonathantneal/precss#variables)):
```css
$helvetica: "Helvetica Neue", Arial, sans-serif;
```
Вложенность ([postcss-nested](https://github.com/postcss/postcss-nested)) для элементов и модификаторов в БЭМе:
```css
.block {
  ...

  &__element {
    ...
  }

  &--modifier {
    ...
  }
}
```
CSSNext: префиксы, [кастомные медиа-запросы](https://github.com/postcss/postcss-custom-media) и другое.

## Сжатие картинок
Картинки кладутся в `src/components/**/*.{png,jpg,gif,svg}` и с помощью [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) минифицируются в папку `public/assets/img/**/*.{png,jpg,gif,svg}`.

## Скрипты
Можно писать на es2015 — подключен и работает Babel. Включен jQuery 3. Работает антикэш (см. абзац о стилях).

## Авторы
[Илья Страйков](https://github.com/straykov), [Кирилл Чернаков](https://github.com/Kiryous), [Олег Алешкин](https://github.com/AleshaOleg), [Арсений Максимов](https://github.com/notarseniy), [Ваня Клименко](https://github.com/vanya-klimenko), [Никита Ейбог](https://github.com/shrpne).

--
Используется в проектах [Кодельной](http://codecode.ru): приходите работать
