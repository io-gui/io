/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

// Include Gulp & tools we'll use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Clean output directory
gulp.task('clean', function (cb) {
  del(['dist'], cb);
});

// Copy all files
gulp.task('copy_bower', function (cb) {
  gulp.src(['bower_components/**/*'])
  .pipe(gulp.dest('dist/elements'))
  .on('end', cb);
});
gulp.task('copy_src', function (cb) {
  gulp.src(['src/**/*'])
  .pipe(gulp.dest('dist/elements'))
  .on('end', cb);
});
gulp.task('copy_vulcanized', function (cb) {
  gulp.src(['src/three-editor/three-editor.html'])
  .pipe($.rename('three-editor.vulcanized.html'))
  .pipe(gulp.dest('dist/elements/three-editor'))
  .on('end', cb);
});

gulp.task('copy_to_akirodic', function (cb) {
  gulp.src(['dist/three-editor.vulcanized.html'])
  .pipe(gulp.dest('../akirodic/app/main-app'))
  .on('end', cb);
});

// Vulcanize granular configuration
gulp.task('vulcanize', function () {
  var DEST_DIR = 'dist';
  return gulp.src('dist/elements/three-editor/three-editor.vulcanized.html')
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(DEST_DIR))
    .pipe($.size({title: 'vulcanize'}));
});

// var jshintTask = function (src) {
//   return gulp.src(src)
//     .pipe($.jshint.extract()) // Extract JS from .html files
//     .pipe($.jshint())
//     .pipe($.jshint.reporter('jshint-stylish'))
//     .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
// };

gulp.task('jshint', function () {
  gulp.src([
      'src/**/*.html',
      'src/**/*.js',
      'gulpfile.js'
    ])
    .pipe($.jshint.extract()) // Extract JS from .html files
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Watch Files For Changes & Reload
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
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['src', 'bower_components']
    }
  });

  // gulp.watch(['src/**/*.html'], reload);
  // gulp.watch(['src/**/*.css'], reload);
  // gulp.watch(['src/**/*.js'], reload);
  gulp.watch(['src/**/*.html'], reload_and_vulanize);
  gulp.watch(['src/**/*.css'], reload_and_vulanize);
  gulp.watch(['src/**/*.js'], reload_and_vulanize);

  runSequence(['default']);
});

var reload_and_vulanize = function () {
  reload();
  runSequence(
    ['copy_src', 'copy_vulcanized'],
    // 'jshint'
    'vulcanize',
    'copy_to_akirodic'
  );
}

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
  runSequence(
    ['copy_bower', 'copy_src', 'copy_vulcanized'],
    // 'jshint',
    'vulcanize',
    cb
  );
});


// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
require('web-component-tester').gulp.init(gulp);

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
