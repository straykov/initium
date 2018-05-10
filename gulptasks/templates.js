const fs           = require('fs');
const gulp         = require('gulp');
const plumber      = require('gulp-plumber');
const twig         = require('gulp-twig');
const data         = require('gulp-data');
const paths        = require('./paths');
const errorHandler = require('./utils').onError;
const reload       = require("./server").reload;

const prettyParams = {
  indent_char: ' ',
  indent_size: 2
};

function getTemplatesData() {
  if (fs.existsSync('templates/data.json')) {
    return JSON.parse(fs.readFileSync(paths.json));
  }
}

function templates() {
  return gulp
    .src(paths.templates + '*.twig')
    .pipe(plumber({errorHandler}))
    .pipe(data(getTemplatesData))
    .pipe(twig())
    .pipe(gulp.dest(paths.html))
    .pipe(reload({stream: true}));
}

gulp.task(templates);
