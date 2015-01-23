var through = require('through2');
var useref = require('node-useref');
var util = require('gulp-util');
var fs = require('fs');
module.exports = function(type, name){
	return through.obj(function(file, env, cb){
		var output = useref(file.contents.toString());
        var assets = output[1];
        var filepaths;
        if( type && assets[type] && name && assets[type][name] ){
        	filepaths = assets[type][name].assets;
        	filepaths.forEach(function(path){
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