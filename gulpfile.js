//要想使用gulp提供的功能，首先要将gulp引入到当前文件中
const cuijn_gulp = require('gulp');

const del = require('del')

//gulp是一个基于task(任务)的构建工具，我们需要在执行构建步骤时，先创建任务
// cuijn_gulp.task('任务名称', 回调函数)

// async function testTask() {
//     console.log('测试环境配置是否成功');
// }

// cuijn_gulp.task('test', testTask);

async function copyIndex(){
    cuijn_gulp.src('./src/index.html')
    .pipe(cuijn_gulp.dest('./dist'))
}

cuijn_gulp.task('copy-index',copyIndex)

async function copyHtml(){
    cuijn_gulp.src('./src/html/*.html')
    .pipe(cuijn_gulp.dest('./dist/html'))
}

cuijn_gulp.task('copy-html',copyHtml)

async function copyImg() {
    // 路径中的**，代表将文件夹下的路径结构，整体拷贝走
    cuijn_gulp.src('./src/assets/img/**/*.{jpg,gif,png}')
        .pipe(cuijn_gulp.dest('./dist/assets/img'))
}

cuijn_gulp.task('copy-img', copyImg)

async function copyLib(){
    cuijn_gulp.src('./src/lib/**/*.*')
    .pipe(cuijn_gulp.dest('./dist/lib'))
}


cuijn_gulp.task('copy-lib',copyLib)


var copyAll = cuijn_gulp.parallel(copyIndex, copyHtml, copyImg, copyLib)
cuijn_gulp.task('copy', copyAll);

var sass = require('gulp-sass');
async function sassTask() {
    cuijn_gulp.src('./src/style/**/*.scss')
              .pipe(sass({
                  outputStyle: "compressed"
              }))
              .pipe(cuijn_gulp.dest('./dist/css/'))

}

cuijn_gulp.task('sass', sassTask)

const babel = require('gulp-babel')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
async function homeJs(){
cuijn_gulp.src('./src/js/home/**/*.js')
.pipe(concat('home.js'))
.pipe(babel({
    presets:['@babel/env']

}))
.pipe(uglify())
.pipe(cuijn_gulp.dest('./dist/js/home'))
}



cuijn_gulp.task('js-home',homeJs)

const sprite = require('gulp.spritesmith')
async function spriteCreate(){
    cuijn_gulp.src('./src/assets/icons/*.png')
    .pipe(sprite({
        imgName:"精灵图.png",
        cssName:"精灵图.css"
    }))
    .pipe(cuijn_gulp.dest('./dist/assets/icons'))
}

cuijn_gulp.task('sprite',spriteCreate)



var build = cuijn_gulp.series(clean, cuijn_gulp.parallel(homeJs, sassTask, copyAll))
cuijn_gulp.task('build', build)

function clean() {
    return del(['build'])
}

function watch() {
    cuijn_gulp.watch('./src/index.html', copyIndex)
    cuijn_gulp.watch('./src/assets/img/**/*.{jpg,png,gif,jpeg}', copyImg)
    cuijn_gulp.watch('./src/html/*.html', copyHtml)
    cuijn_gulp.watch('./src/lib/**/*.*', copyLib)
    cuijn_gulp.watch('./src/style/**/*.scss', sassTask)
    cuijn_gulp.watch('./src/js/home/**/*.js', homeJs)
}

cuijn_gulp.task('watch', watch)