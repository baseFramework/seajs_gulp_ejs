/* 构建工具 */
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    gls = require('gulp-live-server'),
    gulpSequence = require('gulp-run-sequence'),
    strReplace = require('gulp-replace'),
    copy = require('gulp-copy');

/* html相关的插件 */
var prettify = require('gulp-html-prettify'),
    transport = require('gulp-cmd-transport');

/* css编译、合并、优化 */
var sass = require('gulp-sass'),
    uncss = require('gulp-uncss-sp'),
    inlinecss = require('gulp-inline-source'),
    minifycss = require('gulp-minify-css');

/* js编译、合并、优化 */
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

/**
 *    具体的构建任务
 *
 **/
/* html模板引擎 */
gulp.task('prettify', function () {
    gulp.src('app/*.html')
        .pipe(prettify({indent_char: ' ', indent_size: 4}))
        .pipe(gulp.dest('./app'));
});
gulp.task('inline-source', function () {
    gulp.src('dist/public/*.html')
        .pipe(inlinecss())
        .pipe(gulp.dest('dist/public/'));
});
gulp.task('pasetpl', function () {
    return gulp.src('src/template/*.tpl')
        .pipe(transport())
        .pipe(gulp.dest('dist/public/js/tpl'))
        .pipe(strReplace('src/template/', ''))
        .pipe(gulp.dest('dist/public/js/tpl'));

});

gulp.task('transport-common', function () {
    return gulp.src('src/js/common/*.js')
        .pipe(transport())
        .pipe(strReplace('src/js/common/', ''))
        .pipe(gulp.dest('dist/public/js/common'));
});

gulp.task('transport-page', function () {
    return gulp.src('src/js/page/*.js')
        .pipe(transport())
        .pipe(strReplace('src/js/page/', ''))
        .pipe(gulp.dest('dist/public/js/page'));
});

gulp.task('transport-base', function () {
    return gulp.src(['src/js/base/lang.js', 'src/js/base/template.js', 'src/js/base/util.js', 'src/js/base/lazyloaded.js'])
        .pipe(transport())
        .pipe(strReplace('src/js/base/', ''))
        .pipe(gulp.dest('dist/public/js/base'));
})

/* CSS任务 */
gulp.task('css', function () {
    gulp.src(['src/sass/base/core.sass'])
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            dirname: ".",
            basename: "base"
        }))
        // .pipe(uncss({html: ["app/index.html"]})) // 去掉一些无关紧要的css
        .pipe(gulp.dest('dist/public/css'))
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/public/css'))

    gulp.src('src/sass/page/*.sass')
        .pipe(sass().on('error', sass.logError))
        // .pipe(uncss({html: ["app/index.html"]})) // 去掉一些无关紧要的css
        .pipe(gulp.dest('dist/public/css'))
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/public/css'));
});

/* js任务 */
gulp.task('uglify', function () {
    gulp.src('dist/public/js/index.js')
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('copyHtml',function(){
    gulp.src('app/*.html')
        .pipe(gulp.dest('dist/public/'));
})


gulp.task('copyjs', function () {
    gulp.src('src/js/base/sea.min.js')
        .pipe(gulp.dest('dist/public/js/base'));
    gulp.src('src/js/base/zepto.min.js')
        .pipe(gulp.dest('dist/public/js/base'));
    gulp.src('src/js/base/TouchSlide.js')
        .pipe(gulp.dest('dist/public/js/base'));
    gulp.src('src/js/base/lazyloaded.js')
        .pipe(gulp.dest('dist/public/js/base'));
});

gulp.task('copy-server', function () {
    gulp.src('server/**/*.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('concat', function () {
    return gulp.src([
        'dist/public/js/base/sea.min.js',
        'dist/public/js/base/zepto.min.js',
        'dist/public/js/base/TouchSlide.js',
        'dist/public/js/base/lang.js',
        'dist/public/js/base/template.js',
        'dist/public/js/base/util.js',
        'dist/public/js/base/config.js',
        'dist/public/js/base/lazyloaded.js',
        'dist/public/js/tpl/*.js',
        'dist/public/js/common/*.js'
    ]).pipe(concat('common.js')).pipe(gulp.dest('dist/public/js/'));
});

gulp.task('clean', function () {
    return gulp.src('dist/')
        .pipe(clean());
});

// 复制页面主文档
gulp.task('copyFtl', function () {
    gulp.src('app/*.ftl')
        .pipe(gulp.dest('dist/public/'));
});

/* 图片优化 */
gulp.task('copyimage', function () {
    gulp.src('src/image/*')
        .pipe(gulp.dest('dist/public/image'));
});


gulp.task('image', function () {
    gulpSequence('copyimage');
});


/* 启动监测代码 */
gulp.task('watch', function () {
    gulp.watch(['src/**/*.sass'], ['css']);
    gulp.watch(['app/*.ftl'], ['copyFtl']);
    gulp.watch(['src/image/*'], ['image']);
});

/* default任务 */
gulp.task('release', gulpSequence('clean', 'copyimage', 'css', ['copyjs', 'copy-server','copyHtml'], 'pasetpl', 'transport-common', 'transport-page', 'transport-base', 'concat', 'uglify','inline-source'));
gulp.task('dev', gulpSequence('clean', 'copyimage', 'css', ['copyjs', 'copy-server','copyHtml'], 'pasetpl', 'transport-common', 'transport-page', 'transport-base', 'concat','inline-source'));
