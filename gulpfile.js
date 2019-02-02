var gulp = require("gulp"),
    ts = require("gulp-typescript"),
    jsonMinify = require("gulp-json-minify"),
    tsProject = ts.createProject("tsconfig.json");

gulp.task("typescript", function() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("build"));
});

gulp.task("json", function() {
  return gulp.src("src/**/*.json")
    .pipe(jsonMinify())
    .pipe(gulp.dest("build/src"));
});

gulp.task("default", gulp.series("typescript", "json"));
