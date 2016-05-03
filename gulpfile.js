(function() {

'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('serve', function () {
  browserSync({
    port: 5000,
    notify: false,
    open: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function (snippet) {
          return snippet;
        }
      }
    },
    server: {
      baseDir: ['src', 'components', 'bower_components']
    }
  });

  gulp.watch(['src/**/*.html'], reload);
  gulp.watch(['src/**/*.css'], reload);
  gulp.watch(['src/**/*.js'], reload);
});

gulp.task('default', ['serve']);

}());
