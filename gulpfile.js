const gulp = require('gulp');
const bower = require('gulp-bower');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject-string');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const minifyCSS = require('gulp-minify-css');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const gulpSequence = require('gulp-sequence').use(gulp);
const shell = require('gulp-shell');
const plumber = require('gulp-plumber');
const moment = require('moment');

const paths = {
  bower: './bower_components',
  src: './src',
  dev: './.dev',
  dist: '.'
};

const sassPaths = [
  `${paths.bower}/slick-carousel/slick`,
  `${paths.bower}/breakpoint-sass/stylesheets`
];

const jsPaths = [
  `${paths.bower}/jquery/dist/jquery.js`,
  `${paths.bower}/slick-carousel/slick/slick.js`,
  `${paths.bower}/moment/moment.js`,
  `${paths.src}/scripts/**/*.js`
];

const imagePaths = [
  `${paths.bower}/slick-carousel/slick/*{jpg,jpeg,png,gif,svg}`,
  `${paths.src}/images/**/*`
];

const fontPaths = [
  `${paths.bower}/slick-carousel/slick/fonts/*`,
  `${paths.src}/fonts/*`
];

const autoPrefixBrowserList = [
  'last 3 versions',
  'ie 9'
];

const htmlMinOptions = {
  collapseWhitespace: true,
  removeComments: true,
  minifyJS: true
};

gulp.task('bower', () => {
  return bower();
});

gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: paths.dev
    },
    options: {
      reloadDelay: 250
    },
    notify: false
  });
});

gulp.task('images', () => {
  return gulp.src(imagePaths)
    .pipe(plumber())
    .pipe(gulp.dest(`${paths.dev}/images`));
});

gulp.task('images-production', () => {
  return gulp.src(imagePaths)
    .pipe(plumber())
    .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
    .pipe(gulp.dest(`${paths.dist}/images`));
});

gulp.task('scripts', () => {
  return gulp.src(jsPaths)
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(`${paths.dev}/scripts`))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts-production', () => {
  return gulp.src(jsPaths)
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(`${paths.dist}/scripts`));
});

gulp.task('styles', () => {
  return gulp.src(`${paths.src}/styles/main.scss`)
    .pipe(plumber({
      errorHandler(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sourceMaps.init())
    .pipe(sass({
      errLogToConsole: true,
      includePaths: sassPaths
    }))
    .pipe(autoprefixer({
      browsers: autoPrefixBrowserList,
      cascade: true
    }))
    .on('error', gutil.log)
    .pipe(concat('main.css'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(`${paths.dev}/styles`))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles-production', () => {
  return gulp.src(`${paths.src}/styles/main.scss`)
    .pipe(plumber())
    .pipe(sass({
      includePaths: sassPaths
    }))
    .pipe(autoprefixer({
      browsers: autoPrefixBrowserList,
      cascade: true
    }))
    .pipe(concat('main.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(`${paths.dist}/styles`));
});

gulp.task('fonts', () => {
  return gulp.src(fontPaths)
    .pipe(plumber())
    .pipe(gulp.dest(`${paths.dev}/fonts`))
    .pipe(browserSync.reload({stream: true}))
    .on('error', gutil.log);
});

gulp.task('fonts-production', () => {
  return gulp.src(fontPaths)
    .pipe(plumber())
    .pipe(gulp.dest(`${paths.dist}/fonts`))
    .on('error', gutil.log);
});

gulp.task('html', () => {
  return gulp.src(`${paths.src}/*.html`)
    .pipe(plumber())
    .pipe(inject.replace('<!-- updated-on -->', moment().format('M . D . YYYY')))
    .pipe(gulp.dest(`${paths.dev}`))
    .pipe(browserSync.reload({stream: true}))
    .on('error', gutil.log);
});

gulp.task('html-production', () => {
  return gulp.src(`${paths.src}/*.html`)
    .pipe(plumber())
    .pipe(inject.replace('<!-- updated-on -->', moment().format('M . D . YYYY')))
    .pipe(htmlmin(htmlMinOptions))
    .pipe(gulp.dest(`${paths.dist}`))
    .pipe(browserSync.reload({stream: true}))
    .on('error', gutil.log);
});

gulp.task('clean', () => {
  return shell.task([
    'rm -rf .dev'
  ]);
});

gulp.task('clean-production', () => {
  return shell.task([
    'rm -rf fonts',
    'rm -rf images',
    'rm -rf scripts',
    'rm -rf styles'
  ]);
});

gulp.task('scaffold', () => {
  return shell.task([
    `mkdir ${paths.dev}`,
    `mkdir ${paths.dev}/fonts`,
    `mkdir ${paths.dev}/images`,
    `mkdir ${paths.dev}/scripts`,
    `mkdir ${paths.dev}/styles`
  ]);
});

gulp.task('scaffold-production', () => {
  return shell.task([
    `mkdir ${paths.dist}`,
    `mkdir ${paths.dist}/fonts`,
    `mkdir ${paths.dist}/images`,
    `mkdir ${paths.dist}/scripts`,
    `mkdir ${paths.dist}/styles`
  ]);
});

gulp.task('default',
  [
    'bower',
    'clean',
    'scaffold',
    'browserSync',
    'scripts',
    'styles',
    'images',
    'html',
    'fonts'
  ], () => {
    gulp.watch(`${paths.src}/scripts/**`, ['scripts']);
    gulp.watch(`${paths.src}/styles/**`, ['styles']);
    gulp.watch(`${paths.src}/images/**`, ['images']);
    gulp.watch(`${paths.src}/fonts/**`, ['fonts']);
    gulp.watch(`${paths.src}/*.html`, ['html']);
  }
);

gulp.task('build',
  gulpSequence(
    'bower',
    'clean-production',
    'scaffold-production',
    [
      'scripts-production',
      'styles-production',
      'images-production',
      'fonts-production',
      'html-production'
    ]
  )
);
