(function (root) {

  var _ = root._ || require('../vendor/underscore');

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
  
  var generationTwoFuture = (function () {
    
    var TABLE = [
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0]
    ];

    return function generationTwoFuture () {
      var nw = this.children[0],
          ne = this.children[1],
          se = this.children[2],
          sw = this.children[3];

      var nwState = nw.children[2].id,
          neState = ne.children[3].id,
          seState = se.children[0].id,
          swState = sw.children[1].id;

      // includes +2 if self is alive
      var nwCount = nw.children[0].id + nw.children[1].id + ne.children[0].id
                  + nw.children[3].id                     + ne.children[3].id
                  + sw.children[0].id + sw.children[1].id + se.children[0].id,

          neCount = nw.children[1].id + ne.children[0].id + ne.children[1].id
                  + nw.children[2].id                     + ne.children[2].id
                  + sw.children[1].id + se.children[0].id + se.children[1].id,

          seCount = nw.children[2].id + ne.children[3].id + ne.children[2].id
                  + sw.children[1].id                     + se.children[1].id
                  + sw.children[2].id + se.children[3].id + se.children[2].id,

          swCount = nw.children[3].id + nw.children[2].id + ne.children[3].id
                  + sw.children[0].id                     + se.children[0].id
                  + sw.children[3].id + sw.children[2].id + se.children[3].id;

      var nwNext  = TABLE[nwState][nwCount],
          neNext  = TABLE[neState][neCount],
          seNext  = TABLE[seState][seCount],
          swNext  = TABLE[swState][swCount];

      var nwCell  = Cell(nwNext),
          neCell  = Cell(neNext),
          seCell  = Cell(seNext),
          swCell  = Cell(swNext);

      return new QuadTree([
        nwCell, neCell, seCell, swCell
      ]);
    }
    
  })();

  _.extend(QuadTree.prototype, {
    future: function () {
      if (this._future) {
        return this._future;
      }
      else if (this.generation === 1) {
        throw "Too small to have a future";
      }
      else if (this.generation === 2) {
        return (this._future = generationTwoFuture.call(this))
      }
      else throw "FIXME: Implement this"
    }
  })

  _.extend(QuadTree, {
    all: all
  });

})(this);