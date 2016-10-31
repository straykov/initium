#Инитум
Шаблон помогает быстро начать вёрстку проекта.

Перед первым запуском:
```bash
sudo npm install
```

##Режимы
Одноразовая сборка:
```bash
gulp
```

Запуск живой сборки на локальном сервере:
```bash
gulp live
```

Живая сборка на локальном сервере и туннель в интернет:
```bash
gulp external-world
```

##Шаблонизация
Шаблоны собираются в папке `templates` с помощью тегов `<include>`. Составные части лежат в `blocks`. Переменные — через `@@var` (см. [gulp-html-tag-include](https://github.com/straykov/gulp-html-tag-include)). Боевые файлы автоматически собираются в корне проекта.

##Стили
Верстаются в `assets/source/styles/layout.pcss`, компилируются в `assets/css/style.css`.

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

--
Используется в проектах [Кодельной](http://code.straykov.ru) <img src="http://code.straykov.ru/assets/img/logo.svg" height="19"> и [Гридли](http://gridly.ru)
