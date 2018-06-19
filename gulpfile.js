
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var sass= require('gulp-sass');

/**
 * Gulp Tasks
 */

 //sass Tasks
 gulp.task('sass', function() {
     return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'public/scss/*.scss'])
         .pipe(sass())
         .pipe(gulp.dest("public/css"))
         .pipe(browserSync.stream());
 });

//js task
gulp.task('js', function(){
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js','node_modules/jquery/dist/jquery.min.js','node_modules/popper.js/dist/umd/popper.min.js'])
   .pipe(gulp.dest("public/js"))
   .pipe(browserSync.stream());
});

//serve task
gulp.task('serve', ['nodemon'], function() {
  browserSync.init({
    server:"./public"
  });
  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss','public/scss/*.scss'],['sass']);
  gulp.watch("public/*.html").on('change',browserSync.reload);
});

//nodemon task
gulp.task('nodemon',['sass'], function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

//default
gulp.task('default', ['js','serve'], function () {
  gulp.watch(['public/*.html'], reload);
});
