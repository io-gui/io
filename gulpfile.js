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

// gulp.task('copy_to_akirodic', function (cb) {
//   gulp.src(['dist/three-editor.vulcanized.html'])
//   .pipe(gulp.dest('../akirodic/app/main-app'))
//   .pipe(gulp.dest('../saph-cloud/app/components'))
//   .on('end', cb);
// });

// Vulcanize granular configuration
gulp.task('vulcanize', function () {
  var DEST_DIR = 'dist';
  return gulp.src('dist/elements/three-editor/three-editor.vulcanized.html')
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .on('error', function(e) {
      console.log(e)
    })
    .pipe(gulp.dest(DEST_DIR))
    .pipe($.size({title: 'vulcanize'}));
});


// Lint JavaScript
gulp.task('lint', function() {
  return gulp.src([
    'src/three-js/js/**/*.js',
      // 'src/**/*.js',
      // 'src/**/*.js',
      // 'src/**/*.html',
      // 'gulpfile.js',
      // '!src/three-js/js/build/*.js',
      // '!src/three-js/js/examples/js/curves/*.js',
      // '!src/three-js/js/examples/js/libs/*.js',
      // '!src/three-js/js/examples/js/renderers/*.js',
      // '!src/three-js/js/examples/js/loaders/*.js'
    ])
    .pipe(reload({
      stream: true,
      once: true
    }))

  // JSCS has not yet a extract option
  .pipe($.if('*.html', $.htmlExtract()))
  .pipe($.jshint())
  .pipe($.jscs())
  .pipe($.jscsStylish.combineWithHintResults())
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
    server: {
      baseDir: ['src', 'bower_components']
    }
  });

  gulp.watch(['src/**/*.html'], reload_and_vulcanize);
  gulp.watch(['src/**/*.css'], reload_and_vulcanize);
  gulp.watch(['src/**/*.js'], reload_and_vulcanize);

  runSequence(['default']);
});

var reload_and_vulcanize = function () {
  reload();
  runSequence(
    'copy_src',
    'copy_vulcanized',
    'vulcanize'
  );
};

// Build production files, the default task
gulp.task('default', ['clean'], function (cb) {
  runSequence(
    'copy_bower',
    'copy_src',
    'copy_vulcanized',
    'vulcanize'
  );
});


// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
require('web-component-tester').gulp.init(gulp);

// Load custom tasks from the `tasks` directory
try { require('require-dir')('tasks'); } catch (err) {}
