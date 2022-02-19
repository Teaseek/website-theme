const { task, dest, src, series, watch } = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  rename = require('gulp-rename'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer');

var path = {
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

task('sass', () => {
  return src(path.scss.src.main)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ format: 'beautify' }))
    .pipe(dest(path.scss.dest));
});

task('css-min', () => {
  return src(path.css.src)
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(path.css.dest));
});

const build = series('sass', 'css-min');

task('watch', () => {
  watch(path.scss.src.main, build);
  watch(path.scss.src.components, { delay: 500 }, build);
});

task('default', series(build, 'watch'));
