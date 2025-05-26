const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autopreFixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const include = require('gulp-include');

function pages() {
	return src('app/pages/*.html')
	.pipe(include({
		includePaths: 'app/components'
	}))
	.pipe(dest('app'))
	.pipe(browserSync.stream())
}

function scripts(){
    return src([
			'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
      'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}
function styles () {
    return src('app/scss/style.scss', 'app/scss/mobile.scss')
    .pipe(autopreFixer({overrideBrowserslist: ['last 10 version']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed' }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}
function watching(){
    watch(['app/scss/style.scss', 'app/scss/mobile.scss'], styles)
    watch(['app/js/main.js'], scripts)
		watch(['app/components/*', 'app/pages/*'], pages)
    watch(['app/*.html']).on('change', browserSync.reload);
}

function browsersync(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() {
    return src('dist')
    .pipe(clean())
}

function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
				'app/js/bootstrap.js',
        'app/*.html',
				'app/fonts/*.*',
				'app/images/*.*',
				'app/category/*.html',
				'app/pages/*.html',
        'app/*.php',
    ], {base: 'app'})
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.pages = pages;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, browsersync, pages, watching);