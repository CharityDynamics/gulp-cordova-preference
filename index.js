'use strict';

/**
 * Add a cordova preference to your config.xml file.
 *
 * @author Sam Verschueren	  <sam.verschueren@gmail.com>
 * @since  14 May 2015
 */

// module dependencies
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var Config = require('cordova-config');

// export the module
module.exports = function (name, value) {
	var prefs = name;

	if (typeof name !== 'object') {
		// If name is not an object, it is the key and value is the value
		prefs = {};
		prefs[name] = value;
	}

	return through.obj(function (file, enc, cb) {
		try {
			// Load the config.xml file
			var config = new Config(path.join(file.path, 'config.xml'));

			// Iterate over the preferences and update the preference
			Object.keys(prefs).forEach(function (name) {
				config.setPreference(name, prefs[name]);
			});

            self = this;
            config.write()
            .then(function() {
                self.push(file);
                cb();
            })
		} catch (err) {
			cb(new gutil.PluginError('gulp-cordova-preference', err.message));
		}
	});
};
