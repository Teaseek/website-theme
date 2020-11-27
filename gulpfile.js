// Sass configuration
const gulp = require('gulp'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      cssbeautify = require('gulp-cssbeautify');

gulp.task('sass', () => {
  return gulp
    .src('./style/style.scss')
    .pipe(sass())
    .pipe(cssbeautify({
      indent: '  '
    }))
    .pipe(gulp.dest('./style/css/'));
});

gulp.task('sass-min', () => {
  return gulp
    .src('./style/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./style/css/'));
});

gulp.task(
  'default',
  gulp.series('sass', 'sass-min', (cb) => {
    gulp.watch('./style/*.scss', gulp.series('sass', 'sass-min'));
    cb();
  })
);