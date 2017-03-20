const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglifyjs');
const rename = require('gulp-rename');

gulp.task('default', () => {
    return gulp.src('index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(rename('index.es5.js'))
        .pipe(gulp.dest('.'))
        .pipe(uglify())
        .pipe(rename('index.min.js'))
        .pipe(gulp.dest('.'));
});
