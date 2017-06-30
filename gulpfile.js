// Gulpfile
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect');

var jsSources = ['public/static/js/*.js'],
    sassSources = ['public/static/css/scss/**/*.scss'];

gulp.task('sass', function() {
  gulp.src('public/static/css/scss/main.scss')
  .pipe(sass())
  .on('error', gutil.log)
  .pipe(gulp.dest('public/static/css/'))
});

/* No need for this yet
gulp.task('js', function() {
  gulp.src(jsSources)
  .pipe(gulp.dest('public/static/js'))
});
*/

gulp.task('watch', function() {
  //gulp.watch(jsSources, ['js']);
  gulp.watch(sassSources, ['sass']);
});

gulp.task('connect', function() {
  connect.server({
    port: 6060
  })
});

gulp.task('default', ['sass', 'connect', 'watch']);
