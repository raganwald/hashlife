(function (root) {
  
  var _ = root._ || require('underscore');
  
  require('../vendor/underscore-contrib');
  
  var env = require('./quad-tree');
  
  require('./children');
    
  var QuadTree = env.QuadTree,
      Cell = env.Cell;
  
  function mapConcat (choices) {
    return function (list) {
      return _.map(choices, function (choice) {
        return list.concat([choice])
      })
    }
  }

  function flatMapWith (fn, list) {
    return _.reduce(list, function (acc, element) {
      return acc.concat(fn(element));
    }, [])
  }
  
  function unit (choices) {
    return _.map(choices, function (choice) {
      return [choice];
    });
  }

  function forChoices (choices) {
    var chooser = _.partial(flatMapWith, mapConcat(choices));
    return _.map(
      _.compose(chooser, chooser, chooser)(unit(choices)), 
      function (children) { return new QuadTree(children); });
  }
  
  function all (generation) {
    if (generation === 0) {
      return [Cell(0), Cell(1)];
    }
    else return forChoices(all(generation - 1));
  }
  
  // Precompute futures for all 4x4 cells
  _.each(all(2), function (fourByFour) {
    var nw = fourByFour.children[0],
        ne = fourByFour.children[1],
        se = fourByFour.children[2],
        sw = fourByFour.children[3];
        
    var nwState = nw.children[2].id,
        neState = ne.children[3].id,
        seState = se.children[0].id,
        swState = sw.children[1].id;
        
    // includes +2 if self is alive
    var nwCount = nw.children[0].id
                + fourByFour.subTreeByIndices(-1, 0).population
                + fourByFour.subTreeByIndices(0, -1).population
                + se.children[0].id,
        
        neCount = ne.children[1].id
                + fourByFour.subTreeByIndices(0, -1).population
                + fourByFour.subTreeByIndices(1, 0).population
                + sw.children[1].id,
        
        seCount = se.children[2].id
                + fourByFour.subTreeByIndices(1, 0).population
                + fourByFour.subTreeByIndices(0, 1).population
                + nw.children[2].id,
        
        swCount = sw.children[3].id
                + fourByFour.subTreeByIndices(0, 1).population
                + fourByFour.subTreeByIndices(-1, 0).population
                + ne.children[3].id;
                
    var nwNext  = new Cell( nextState(nwState, nwCount) ),
        neNext  = new Cell( nextState(neState, neCount) ),
        seNext  = new Cell( nextState(seState, seCount) ),
        swNext  = new Cell( nextState(swState, swCount) );
  
    fourByFour._future = new QuadTree([nwNext, neNext, seNext, swNext]);
                
    function nextState(state, count) {
      if (state === 0) {
        return count === 3
               ? 1
               : 0;
      }
      else return (count === 4 || count === 5)
                  ? 1
                  : 0;
    }
  });
  
  _.extend(QuadTree, {
    all: all
  });
  
  _.extend(QuadTree.prototype, {
    future: function () { return this._future; }
  });
  
})(this);