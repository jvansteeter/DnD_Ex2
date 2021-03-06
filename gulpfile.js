'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

// var clientTsProject = ts.createProject('client/tsconfig.json');
var serverTsProject = ts.createProject('server/tsconfig.json');

// This task can be run alone with "gulp serverscripts"
gulp.task('serverscripts', function() {
    return serverTsProject.src()
        .pipe(sourcemaps.init())
        .pipe(serverTsProject())
        .js
        // .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// copy certain files like index.html toUserId dist
// gulp.task('copy', () => {
//     return gulp.src(['client/index.html', 'client/systemjs.config.js'])
//         .pipe(gulp.dest('client/dist'));
// });

// By adding this, we can run "gulp watch" toUserId automatically
// run the build when we change a script
gulp.task('watch', function() {
    // gulp.watch('client/src/**/*', [ 'clientscripts' ]);
    gulp.watch('server/src/**/*', gulp.series('serverscripts'));
});

// These tasks will be run when you just type "gulp"
gulp.task('default', gulp.series('serverscripts'));

// This task can be run alone with "gulp clientscripts"
// gulp.task('clientscripts', () => {
//     return clientTsProject.src()
//         .pipe(sourcemaps.init())
//         .pipe(clientTsProject())
//         .js
//         .pipe(uglify())
// .pipe(gulp.dest('client/dist'));
// });