/**
 * Created by zhijie.huang on 2017/3/7.
 */
const fs = require('fs'),
    gulp = require('gulp'),
    browserSync = require('browser-sync'),
    del = require('del'),
    reload = browserSync.reload;


const OUTPUT_PATH = 'dist',
    INDEX_PATH = 'src/index.html';

// watch file change and reload
gulp.task('serve', ['copy'], function() {
    console.log('Task serve running');

    browserSync({
        server: {
            baseDir: OUTPUT_PATH
        }
    });

    gulp.watch(['src/**', '!src/index.html'], ['reload'], function(cb) {
        cb();
    });
});

gulp.task('reload', ['copy'], function () {
    return reload();
});

gulp.task('default', ['serve'], function() {
    console.log('Task default running');
});

gulp.task('copy', ['createIndex'], function() {
    console.log('Task copy running');
    // 返回stream 以正确实现异步任务
    return gulp.src(['src/**']).pipe(gulp.dest('dist'));
});

gulp.task('clean', function(cb) {
    del(['dist/*.*','dist/**/*']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
});

// create index.html
gulp.task('createIndex', ['clean'], function() {
    return createIndex().then((data) => {
        // console.log(data);
    }).catch((err) => {
        console.log('Task createIndex error: ' + err);
    })
});

function createIndex() {

    function createIndexTemp() {
        let links = [], num = 0;
        const files = fs.readdirSync('src');

        files.map((file) => {
            if (file.match(/\w+\.html/)) {
                num++;
                links.push(`${num}. <a href="./${file}">${file}</a>`)
            }
        })
        links = links.join('</br>');

        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>home page</title>
        </head>
        <body>
            <h1>echarts-demo homepage</h1>
            ${links}
        </body>
        </html>`
    }

    return new Promise((resolve, reject) => {
        const template = createIndexTemp();
        fs.writeFile(INDEX_PATH, template, function(err) {
            if (err) {
                reject(err);
            }
            resolve('Index file saved success!');
        })
    })
}