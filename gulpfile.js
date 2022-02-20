const { task, dest, src, series, watch } = require('gulp')
  sass = require('gulp-sass')(require('sass')),
  rename = require('gulp-rename'),
  cleanCSS = require('gulp-clean-css'),
  shorthand = require('gulp-shorthand'),
  csso = require('gulp-csso'),
  del = require('del'),
  gcmq = require('gulp-group-css-media-queries'),
  autoprefixer = require('gulp-autoprefixer');

const path = {
  scss: {
    src: {
      main: 'style/style.scss',
      components: 'style/components/*.scss',
    },
    dest: 'style/css/'
  },
  css: {
    src: 'style/css/style.css',
    dest: 'style/css/'
  }
};

const sassBuild = () => {
  return src(path.scss.src.main)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gcmq())
    .pipe(autoprefixer())
    .pipe(cleanCSS({ format: 'beautify' }))
    .pipe(dest(path.scss.dest));
};

const cssMin = () => {
  return src(path.css.src)
    .pipe(shorthand())
    .pipe(csso())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(path.css.dest));
};

const clear = () => {
  return del(path.css.dest)
}

const build = series(clear, sassBuild, cssMin);

const watchFiles = () => {
  watch(path.scss.src.main, build);
  watch(path.scss.src.components, { delay: 500 }, build);
};

exports.clear = clear;
exports.build = build;
exports.watch = series(build, watchFiles);