// Underscore-contrib (underscore.util.trampolines.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  
  // Mixing in the truthiness
  // ------------------------

  _.mixin({
    decorator: function (decoration) {
      return function decorator () {
        if (arguments[0] !== void 0) {
          return decorator.call(arguments[0]);
        }
        else {
          _.extend(this, decoration);
          return this;
        }
      };
    },

    classDecorator: function (decoration) {
        return function (clazz) {
          function Decorated  () {
            var self = this instanceof Decorated
                       ? this
                       : new Decorated();

            return clazz.apply(self, arguments);
          };
          Decorated.prototype = _.extend(new clazz(), decoration);
          return Decorated;
        };
      }
    });
  
})(this);