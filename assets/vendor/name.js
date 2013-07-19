;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("name/index.js", function(exports, require, module){
/**
 * Private Name ES.next shim
 * Allows you to define hidden properties on objects
 * With the ES.next Name API
 * @module private-name
 */
var id 							= 0
	, prefix 					= '\u2063\u2063\u2063'
	, expando 				= generateName('NameHelper')
	, currentProperty = undefined
	, defineProperty 	= Object.defineProperty
	, exports 				= module.exports = Name

/**
 * Simple Private Names shim 
 * @param {string} publicName string to use for .valueOf() and the private properties internal name
 */
function Name(publicName) {
	var name = generateName(publicName)

	this.valueOf = function() {
		return publicName || '[object Name]'
	}

	this.toString = function(usePublic){
		if(usePublic) return this.valueOf()
		currentProperty = name
		return expando
	}

	this.define = function(obj, desc){
		// hidden properties can never enumerable
		desc.enumerable = false
		return defineProperty(obj, name, desc)
	}
}

Name.isPublic =
function isPublic(name) {
	if(name instanceof Name) return false;
	else return name.substr(0, prefix.length) != prefix
}

Name.isPrivate =
function isPrivate(name){
	return !isPublic(name)
}

/*!
 * This is where the magic happens
 * Define a hidden property on Object.prototype 
 * Because Name#toString returns the expando string this is called every time a private name is accessed
 * Using Object.prototype allows .hasOwnProperty(name) to return false without a shim
 */
defineProperty(Object.prototype, expando, {
	enumerable: false,
	configurable: false,
	get: function() {
		var name = init(this)
		return name && this[name]
	},
	set: function(value) {
		var name = init(this, true)
		if(name) this[name] = value
	}
})

/*!
 * utility methods
 */
 
/**
 * generates a unique name for the property
 * @param  {String} str used for prettier names
 * @return {String} unique name
 */
function generateName(str) {
	var uid = (++id).toString() + Date.now()
		, str = str ? '<Private ' + str + ':' + uid + '>' : uid
	return prefix + str
}

/**
 * Helper method, unsets the currentProperty flag and defines the property if nessarry
 * @param  {Object} self 
 * @param {Boolean} define if set to true, a property will be created if it does not exist
 * @return {String} name of the property or undefined if there was an error     
 */
function init(self, define) {
	var name = currentProperty
	currentProperty = undefined
	if(typeof self.hasOwnProperty != 'function') return undefined
	// make sure all hidden properties are non-enumerable
	if(define && name && name != expando && !self.hasOwnProperty(name)) {
		defineProperty(self, name, {
			configurable: true,
			enumerable: false,
			writable: true,
			value: undefined
		})
	}
	return name
}





});
require.alias("name/index.js", "name/index.js");

if (typeof exports == "object") {
  module.exports = require("name");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("name"); });
} else {
  this["Name"] = require("name");
}})();