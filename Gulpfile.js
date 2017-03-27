const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglifyjs');
const rename = require('gulp-rename');
const replace = require('babel-plugin-transform-rename-import').default;

gulp.task('default', () => {
    gulp.src('src/*.js')
        .pipe(babel({
            presets: ['es2015'],
            // plugins: [
                // [replace, { original: './plugin', replacement: './plugin.es5' }],
            // ],
        }))
        .pipe(gulp.dest('dist'));

    gulp.src('src/*.vue')
        .pipe(gulp.dest('dist'));
});
