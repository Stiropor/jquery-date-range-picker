(function () {
    'use strict';

    var gulp = require('gulp'),
        gutil = require("gulp-util"),
        del = require('del'),
        uglify = require("gulp-uglify"),
        minifyCSS = require("gulp-minify-css"),
        rename = require("gulp-rename"),
        header = require('gulp-header'),
        sass = require('gulp-sass'),
	    watch = require('gulp-watch');

    var pkg = require('./package.json');
    var banner = ['/**',
        ' * <%= pkg.name %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''].join('\n');

    gulp.task('dist:clean', function () {
        del.sync('./dist', {force: true});
    });

	gulp.task('dist:styles', function() {
		gulp.src('./src/*.scss')
			.pipe(sass().on('error', sass.logError))
			.pipe(minifyCSS())
			.pipe(rename('daterangepicker.min.css'))
			.pipe(gulp.dest('./dist'));
	});

    gulp.task('dist:script', ['dist:clean'], function () {
        return gulp.src('./src/*.js')
            .pipe(uglify())
            .pipe(rename('jquery.daterangepicker.min.js'))
            .pipe(header(banner, {pkg: pkg}))
            .pipe(gulp.dest('./dist'))
            .on('error', gutil.log)
    });

	gulp.task('watch', function () {
		watch('./src/*.scss', function() {
			gulp.run(['dist:styles']);
		});
	});

    gulp.task('default', ['dist:clean', 'dist:styles', 'dist:script'], function (cb) {
        gutil.log('Info :', gutil.colors.green('Distribution files are ready!'));
        cb(null)
    });

})();