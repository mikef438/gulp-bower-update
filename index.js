'use strict';
//Adapted from brunocartier's bower-update-all to be used with gulp
var gutil = require('gulp-util');
var execSync = require('child_process').execSync;
var through = require('through2');
var pluginName = 'bower-update-all';
var pluginError = gutil.PluginError;

//isGitOnly flag used to download from dependencies only in git repos
/*jslint indent: 4, maxlen: 80, node: true */
module.exports = function (isGitOnly) {
    'use strict';
    var DependencyUpdater;
    var handleFile;

    DependencyUpdater = function () {
        var // Functions
            updateDependency,
            addDependency,
            updateNext,

            // Variables
            self = {},
            dependencies = [];

        updateDependency = function (dep, cb) {
            var command = 'bower install ' + dep.name + ' --force-latest --save';

            if (dep.dev) {
                command += '-dev';
            }

            var err = execSync(command);
            if (err) {
                console.log('Updated ' + dep.name + ' - ' + err);
            }

            cb();
        };

        addDependency = function (name, dev) {
            dependencies.push({
                name: name,
                dev: !!dev
            });
        };

        updateNext = function () {
            if (dependencies.length) {
                updateDependency(
                    dependencies.shift(),
                    updateNext
                );
            } else {
                console.log('➤ All dependencies updated!');
            }
            return true;
        };

        self.addDependency = addDependency;
        self.updateNext = updateNext;

        return self;
    };

    handleFile = function (data) {
        console.log('➤ Getting and parsing bower.json file...');

        var bowerJson = JSON.parse(data),
            updater = new DependencyUpdater(),
            value = '';

        if (bowerJson.dependencies) {
            Object
                .keys(bowerJson.dependencies)
                .forEach(function (dep) {
                    value = bowerJson.dependencies[dep];
                    if(isGitOnly) {
                        if(value.indexOf('git') > -1) {
                            updater.addDependency(value);
                        }
                    }
                    else {
                        updater.addDependency(value);
                    }
                });
        }

        if (bowerJson.devDependencies) {
            Object
                .keys(bowerJson.devDependencies)
                .forEach(function (dep) {
                    if(isGitOnly) {
                        if(value.indexOf('git') > -1) {
                            updater.addDependency(value);
                        }
                    }
                    else {
                        updater.addDependency(value);
                    }
                });
        }

        return updater.updateNext();
    };

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            console.log('✘ Problem getting your file, please try again.');
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new pluginError(pluginName, 'Streaming not supported'));
            return;
        }
        if(!enc){
            enc = 'utf8';
        }
        var content = file.contents.toString(enc);
        handleFile(content);
        //push back file to stream
        cb(null, file);
    });
};
