#Инитум
Шаблон помогает быстро начать вёрстку проекта.

Перед началом работы нужно установить зависимости:
```bash
npm install
```
Можно Ярном, если есть:
```bash
yarn
```

##Режимы
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

Живая сборка на локальном сервере и туннель в интернет:
```bash
npm run external-world
```
```bash
yarn external-world
```

Сборка на локальном сервере с watch'ем без browsersync'а:
```bash
npm run no-server
```
```bash
yarn no-server
```

##Шаблонизация
Шаблоны собираются из папки `templates` с помощью [pug](https://pugjs.org). Составные части лежат в `blocks`. Боевые файлы автоматически собираются в корне проекта.

##Стили
Верстаются в `assets/source/styles/layout.pcss`, компилируются в `assets/css/style.css`. Работает антикэш.

####PostCSS
Переменные ([postcss-simple-vars](https://github.com/postcss/postcss-simple-vars)):
```css
$f_Helvetica: "Helvetica Neue", Arial, sans-serif;
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
[CSSNext](http://cssnext.io). Штуки из CSS 4, префиксы, кастомные медиа-запросы.

##Сжатие картинок
Картинки кладутся в `assets/source/img/` и с помощью [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) минифицируются в папку `assets/img/`.

##Скрипты
Можно писать на es2015 — подключен и работает Бабель. Включен jQuery 3. Работает антикэш.

##Авторы
[Илья Страйков](https://github.com/straykov), [Кирилл Чернаков](https://github.com/Kiryous), [Олег Алешкин](https://github.com/AleshaOleg), [Арсений Максимов](https://github.com/notarseniy), [Ваня Клименко](https://github.com/vanya-klimenko).

--
Используется в проектах [Кодельной](http://codecode.ru) <img src="http://code.straykov.ru/assets/img/logo.svg" height="19"> и [Гридли](http://gridly.ru)
