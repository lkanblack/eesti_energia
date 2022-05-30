const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass");
const csso = require("gulp-csso");
const include = require("gulp-file-include");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const sync = require("browser-sync").create();
const minify = require("gulp-minify");
const jsonMinify = require("gulp-json-minify");

function image() {
  return src("src/img/*").pipe(imagemin()).pipe(dest("dist/img"));
}

function html() {
  return src("src/**/*.html")
    .pipe(
      include({
        prefix: "@@",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"));
}

function scss() {
  return src("src/scss/**.scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
      })
    )
    .pipe(csso())
    .pipe(concat("index.css"))
    .pipe(dest("dist"));
}

function clear() {
  return del("dist");
}

function js() {
  return src("src/js/**.js").pipe(minify()).pipe(dest("dist/js"));
}

function json() {
  return src("src/**.json").pipe(jsonMinify()).pipe(dest("dist"));
}

function serve() {
  sync.init({
    server: "./dist",
  });

  watch("src/**/*.html", series(html)).on("change", sync.reload);
  watch("src/scss/**.scss", series(scss)).on("change", sync.reload);
  watch("src/js/**.js", series(js)).on("change", sync.reload);
  watch("src/**.json", series(json)).on("change", sync.reload);
}

exports.build = series(clear, scss, html, image, js, json);
exports.serve = series(clear, scss, html, image, js, json, serve);
exports.clear = clear;
