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

## Шаблонизация
Шаблоны собираются из папки `templates` с помощью [twig](https://github.com/twigjs/twig.js/wiki). Составные части лежат в `blocks`. Боевые файлы автоматически собираются в корне проекта. Основной шаблон лежит в `core/layout.twig`. Страницы включают в себя основной шаблон. Код пишется внутри блока `body`:
 ```twig
 {% extends "core/layout.twig" %}
 
 {% block body %}
   ...
 {% endblock %}
 ```
## Кастомные данные при шаблонизации
Чтобы добавить возможность передавать в шаблоны данные (например, расставлять контент в рандомном порядке) необходимо создать файл `templates/data.json` и в `gulpfile.js` заменить таск шаблонизации на следующий: 
```javascript
gulp.task('twig', function() {
  gulp.src(paths.templates + '*.twig')
    .pipe(plumber({errorHandler: onError}))
    .pipe(data(function() {
      if (fs.existsSync('templates/data.json')) {
        return JSON.parse(fs.readFileSync(paths.json));
      }
    }))
    .pipe(twig())
    .pipe(gulp.dest(paths.html))
    .pipe(reload({stream: true}));
});
```
Далее — добавить в таск `watch`:
```javascript
gulp.watch('templates/data.json', ['twig']);
```

## Стили
Верстаются в `assets/source/styles/styles.scss`, компилируются в `assets/css/style.css`. Работает антикэш — к ссылкам на стили добавляется md5-хэш. Предлагается разделение на смысловые слои. Сначала core — фундамент: переменные, сетка, дефолтные стили. Выше — components: кнопки, формы, модальные окна и прочее. Самый высокий уровень — modules: объединение компонентов и стили страниц.

### Шрифты
Файлы шрифтов кладутся в папку `assets/source/fonts` — оттуда они автоматически конвертируются в base64 и помещаются в начало `style.css`.

### SCSS 
Переменные :
```scss
$helvetica: "Helvetica Neue", Arial, sans-serif;
```
Вложенность для элементов и модификаторов в БЭМе:
```scss
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
См. [документацию SASS](http://sass-lang.com/guide)

## Сжатие картинок
Картинки кладутся в `assets/source/img/` и с помощью [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) минифицируются в папку `assets/img/`.

## Скрипты
Можно писать на es2015 — подключен и работает Babel. Включен jQuery 3. Работает антикэш (см. абзац о стилях).

## Авторы
[Илья Страйков](https://github.com/straykov), [Кирилл Чернаков](https://github.com/Kiryous), [Виктор Колб](https://github.com/VictorKolb), [Арсений Максимов](https://github.com/notarseniy), [Ваня Клименко](https://github.com/vanya-klimenko), [Никита Ейбог](https://github.com/shrpne).


Используется в проектах [Кодельной](http://codecode.ru): приходите работать.
