const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglifyjs');
const rename = require('gulp-rename');
const replace = require('babel-plugin-transform-rename-import').default;

gulp.task('default', () => {
    gulp.src('index.js')
        .pipe(babel({
            presets: ['es2015'],
            plugins: [
                [replace, { original: './plugin', replacement: './plugin.es5' }],
            ],
        }))
        .pipe(rename('index.es5.js'))
        .pipe(gulp.dest('.'));

        gulp.src('plugin.js')
        .pipe(babel({
            presets: ['es2015'],
        }))
        .pipe(rename('plugin.es5.js'))
        .pipe(gulp.dest('.'));
});
