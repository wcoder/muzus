'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
//var cssnano = require('gulp-cssnano');

gulp.task('build:sass', function () {
	return gulp.src('./src/*.scss')
		.pipe(sass().on('error', sass.logError))
		//.pipe(cssnano())
		//.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function () {
	gulp.watch('./src/*.scss', ['build:sass']);
});

gulp.task('build:js', function () {
	return gulp.src('src/*.js')
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(replace('setChangeProgressHandler', 'sCPH'))
		.pipe(replace('setClickHandler', 'sCH'))
		.pipe(replace('hideProgressTimeHint', 'hPTH'))
		.pipe(replace('setCurrentTime', 'sCT'))
		.pipe(replace('setProgress', 'sP'))
		.pipe(replace('getState', 'gS'))
		.pipe(replace('setEndTime', 'sET'))
		.pipe(replace('setBuffer', 'sB'))
		.pipe(gulp.dest('dist'));
});
