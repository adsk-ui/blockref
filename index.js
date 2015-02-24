var through = require('through2');
var useref = require('node-useref');
var util = require('gulp-util');
var fs = require('fs');
var minimatch = require('minimatch');
module.exports = function(type, name, pattern){
        return through.obj(function(file, env, cb){
                var output = useref(file.contents.toString());
        var assets = output[1];
        var filepaths;
        var include;
        if( type && assets[type] && name && assets[type][name] ){
                filepaths = assets[type][name].assets;
                filepaths.forEach(function(path){
                        // If any patterns are "includes" (don't start with !), then include is false by default
                        include = !pattern.some(function(step){ return step[0] !== '!'; });
                        if( pattern && pattern.length){
                                pattern.forEach(function(step){
                                        if(typeof step !== 'string')
                                                throw new Error('Include/exclude patterns passed to blockref must be string values');

                                        if (step[0] === '!'){
                                                if(minimatch(path, step.slice(1))){
                                                        include = false;
                                                }
                                        } else if(minimatch(path, step)){
                                                include = true;
                                        }
                                });
                        }

                        if( !include )
                                return;

                        this.push(new util.File({
                                cwd: file.cwd,
                                base: file.base,
                                path: file.base + path,
                                contents: new Buffer(fs.readFileSync( file.base + path ))
                        }));
                }, this);
        }else{
                this.emit('error', new util.PluginError('blockref', 'Could not find block type or name'));
        }
        cb();
        });
};