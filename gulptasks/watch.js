const gulp  = require('gulp');
const paths = require('./paths.js');
const del   = require('del');
const path  = require('path');
const cache = require('gulp-cached');

// Федеральная служба по контролю за оборотом файлов
gulp.task('watch', function() {
  gulp.watch(paths.templates + '**/*.twig', gulp.series('templates'));
  gulp.watch(paths.styles    + '**/*.styl', gulp.series('styles', 'cache'));
  gulp.watch(paths.scripts   + '*.js',      gulp.series('scripts', 'cache'));

  gulp.watch(paths.img + '*.{png,jpg,gif,svg}', gulp.series("img")).on('change', function(event) {
    if (event.type === 'deleted') {
      del(paths.bundles + path.basename(event.path));
      delete cache.caches['img'][event.path];
    }
  });
});
