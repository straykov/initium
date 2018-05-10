const gulp        = require('gulp');
const portfinder  = require('portfinder');
const browserSync = require("browser-sync");
const reload      = browserSync.reload;

module.exports.reload = reload;

// Локальный сервер
gulp.task('server', function() {
  portfinder.getPort(function(err, port) {
    browserSync({
      server: {
        baseDir: "./build/",
        serveStaticOptions: {
          extensions: ['html']
        }
      },
      host: 'localhost',
      notify: false,
      port: port
    });
  });
});

// Рефреш страниц
gulp.task('html', function() {
  return gulp.src(paths.html + '*.html')
    .pipe(reload({stream: true}));
});
