'use strict';

var gulp = require('gulp'),
    rigger = require('gulp-rigger'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    cssmin = require('gulp-minify-css');

var path = {
  build: {
    html: '',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/images/',
    fonts: 'build/fonts/',
    components: 'build/components'
  },
  src: {
    html: 'src/templates/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/main.less',
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    components: 'src/components/**/*'
  },
  watch: {
    html: 'src/templates/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*',
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    components: 'src/components/**/*'
  },
  clean: './build'
};

var config = {
  server: {
      baseDir: "./"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
};

gulp.task('html:build', function () {
  return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  return gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
  return gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});


gulp.task('components:build', function () {
  return gulp.src(path.src.components)
    .pipe(gulp.dest(path.build.components))
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  return gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({stream: true}));
});

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.components], function(event, cb) {
    gulp.start('components:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'components:build'
]);

gulp.task('webserver', function () {
  return browserSync(config);
});

gulp.task('clean', function (cb) {
  return rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);




