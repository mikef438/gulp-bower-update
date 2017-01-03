# gulp-bower-update-all
Force updates to the latest version of your bower dependencies. It does this synchronously to allow for updates to 
complete before executing dependent gulp tasks.

Adapted from brunocartier's [bower-update-all](https://github.com/ActivKonnect/bower-update-all) to be used with gulp
tasks.

Important note, I wrote this to fit a need I had locally and this module probably could use to be extended. I did not
intend to cover numerous use cases.

Usage
--------------

```
sudo npm install gulp-bower-update-all --save-dev
```

```
var bowerUpdate = require('gulp-bower-update-all');

gulp.task('gulp-bower-update-all', function () {
    return gulp.src('bower.json')
      .pipe(bowerUpdate(true))
      .on('error', function (e) {
         gulpUtil.log(e);
       });
});
```

After this, the dependencies in the provided bower.json file will be updated to their latest possible version.

Parameters
--------------
    isGitOnly        Check only for dependencies that point to a .git location
	isSave			 Saves to bower.json file. Default false to always get the latest version.
