(function (root) {

  var _ = root._ || require('../vendor/underscore');

  require('../vendor/underscore-contrib');

  var env = require('./quad-tree');

  require('./children');

  var QuadTree = env.QuadTree,
      Cell = env.Cell;

  var NW = 0,
      NE = 1,
      SE = 2,
      SW = 3;

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
      var nw = this.children[NW],
          ne = this.children[NE],
          se = this.children[SE],
          sw = this.children[SW];

      var nwState = nw.children[SE].id,
          neState = ne.children[SW].id,
          seState = se.children[NW].id,
          swState = sw.children[NE].id;

      // includes +2 if self is alive
      var nwCount = nw.children[NW].id + nw.children[NE].id + ne.children[NW].id
                  + nw.children[SW].id                      + ne.children[SW].id
                  + sw.children[NW].id + sw.children[NE].id + se.children[NW].id,

          neCount = nw.children[NE].id + ne.children[NW].id + ne.children[NE].id
                  + nw.children[SE].id                      + ne.children[SE].id
                  + sw.children[NE].id + se.children[NW].id + se.children[NE].id,

          seCount = nw.children[SE].id + ne.children[SW].id + ne.children[SE].id
                  + sw.children[NE].id                      + se.children[NE].id
                  + sw.children[SE].id + se.children[SW].id + se.children[SE].id,

          swCount = nw.children[SW].id + nw.children[SE].id + ne.children[SW].id
                  + sw.children[NW].id                      + se.children[NW].id
                  + sw.children[SW].id + sw.children[SE].id + se.children[SW].id;

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
  
  // ....|....
  // ....|....    ...|...
  // ....|....    ...|...
  // ....|....    ...|...
  // ----+---- => ---+---
  // ....|....    ...|...
  // ....|....    ...|...
  // ....|....    ...|...
  // ....|....
  
  function bigFuture () {
    
    var nw = this.children[NW],
        ne = this.children[NE],
        se = this.children[SE],
        sw = this.children[SW];
        
    var nn = new QuadTree(
          nw.children[NE],
          ne.children[NW],
          ne.children[SW],
          nw.children[SE]
        ),
        ee = new QuadTree(
          ne.children[SW],
          ne.children[SE],
          se.children[NE],
          se.children[NW]
        ),
        
    
  }

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