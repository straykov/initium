const gulp = require('gulp');

// Одноразовая сборка
gulp.task('default', gulp.series('templates', 'styles', 'scripts', 'img', 'cache'));

// Запуск живой сборки
gulp.task('live', gulp.series('templates', 'styles', 'scripts', 'img', 'cache', gulp.parallel('server', 'watch')));

// Cборка с вотчем без браузерсинка
gulp.task('no-server', gulp.series('templates', 'styles', 'scripts', 'img', 'cache', 'watch'));



