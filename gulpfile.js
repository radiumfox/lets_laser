const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const del = require("del");
const sync = require("browser-sync").create();
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const svgSymbols = require('gulp-svg-symbols');

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Scripts

const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(plumber())
    .pipe(concat("main.js"))
    .pipe(gulp.dest("build/js/"))
    .pipe(terser())
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest("build/js/"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Sprite

const sprite = () => {
  return gulp.src('source/assets/icons/*.svg')
      .pipe(svgSymbols({
        templates: ['default-svg']
      }))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest('build/assets/icons'));
}

exports.sprite = sprite;

// Images

const optimizeImages = () => {
  return gulp.src("source/assets/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/assets"))
}

exports.images = optimizeImages;

const copyImages = () => {
  return gulp.src("source/assets/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/assets"))
}

exports.images = copyImages;

// WebP

const createWebp = () => {
  return gulp.src("source/assets/**/*.{jpg,png}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/assets"))
}

exports.createWebp = createWebp;

// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/assets/**/*.svg",
    "source/js/*.js",
    "source/assets/*.mp4",
    "!source/assets/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html", gulp.series(html, reload));
  gulp.watch("source/js/*.js", gulp.series(scripts));
}

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp,
    sprite
  ),
  gulp.series(
    server,
    watcher
  ));
