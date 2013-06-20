(function (root) {
  
  var _ = root._ || require('../vendor/underscore');
  
  require('../vendor/underscore-contrib');
  
  var env = require('./quad-tree');
    
  var QuadTree = env.QuadTree,
      Cell = env.Cell;
      
  _.extend(Cell.prototype, {
    toJSON: function () {
      return this.id;
    }
  });
  
  _.extend(QuadTree.prototype, {
    toJSON: function () {
      var childrenJSON = _.invoke(this.children, 'toJSON');
      if (this.generation === 1) {
        return [[childrenJSON[0], childrenJSON[1]], [childrenJSON[3], childrenJSON[2]]];
      }
      else {
        var topHalf = _.map(_.zip(childrenJSON[0], childrenJSON[1]), function (pair) {
          return pair[0].concat(pair[1]);
        });
        var bottomHalf = _.map(_.zip(childrenJSON[3], childrenJSON[2]), function (pair) {
          return pair[0].concat(pair[1]);
        });
        return topHalf.concat(bottomHalf);
      }
    }
  });
  
})(this);