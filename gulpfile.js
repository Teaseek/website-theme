// Sass configuration
var gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

gulp.task('sass',  () => {
  return gulp
    .src('*.scss')
    .pipe(sass())
    .pipe(
      gulp.dest(function(f) {
        return f.base;
      })
    );
});

gulp.task('minify-css', () => {
  return gulp
    .src('theme.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(
      gulp.dest(function(f) {
        return f.base;
      })
    );
});

gulp.task(
  'default',
  gulp.series('sass', function(cb) {
    gulp.watch('*.scss', gulp.series('sass'));
    gulp.watch('theme.css', gulp.series('minify-css'));
    cb();
  })
);