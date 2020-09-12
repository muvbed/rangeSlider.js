var gulp = require('gulp'),
	glp = require('gulp-load-plugins')(),
	gcmq = require('gulp-group-css-media-queries'),
	del = require('del'),
	browserSync = require('browser-sync').create();

gulp.task('pug', function() {
	return gulp.src('app/pug/*.pug')
	.pipe(glp.pug({
		pretty: true 
	}))
	.pipe(gulp.dest('dist/'))
	.on('end', browserSync.reload)
});

gulp.task('stylus', function() {
	return gulp.src('app/stylus/*.styl')
	.pipe(glp.stylus({
		'include css': true
	}))
	.pipe(glp.autoprefixer({
		browsers: ['ie >= 8', 'last 4 version']
	}))
	.pipe(gcmq())
	.pipe(glp.csso())
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('scripts', function() {
	return gulp.src('app/js/*.js')
	.pipe(glp.browserify())
	.pipe(glp.babel({
		"presets": ["@babel/preset-env"]
	}))
	.pipe(glp.uglify())
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('scripts:libs', function() {
	return gulp.src('app/js/libs/*.js')
	.pipe(glp.uglify())
	.pipe(gulp.dest('dist/js/libs'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('static', function() {
	return gulp.src('app/static/**/*.*')
	.pipe(gulp.dest('dist/'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('img:dev', function() {
	return gulp.src('app/img/**/*.png')
	.pipe(gulp.dest('dist/img'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('img:build', function() {
	return gulp.src('app/img/**/*.png')
	.pipe(glp.tinypng('Kk_P4FyRoQGwHhY6jEVHty1sIfNxFkKN'))
	.pipe(gulp.dest('dist/img'))
});

gulp.task('clean', function() {
	return del('dist');
});

gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: 'dist/'
		}
	})
});

gulp.task('watch', function() {
	gulp.watch('app/**/**/*.pug', gulp.series('pug'))
	gulp.watch('app/**/**/*.styl', gulp.series('stylus'))
	gulp.watch('app/**/**/*.css', gulp.series('stylus'))
	gulp.watch('app/**/**/*.js', gulp.series('scripts'))
	gulp.watch('app/js/libs/*.js', gulp.series('scripts:libs'))
	gulp.watch('app/static/**/*.*', gulp.series('static'))
	gulp.watch('app/img/**/*.png', gulp.series('img:dev'))
});

gulp.task('default', gulp.series(
	gulp.parallel('pug', 'stylus', 'scripts:libs', 'scripts', 'static', 'img:dev'), 
	gulp.parallel('serve', 'watch')
));

gulp.task('build', gulp.series(
	'clean', 'pug', 'stylus', 'scripts', 'scripts:libs', 'static', 'img:build'
));
