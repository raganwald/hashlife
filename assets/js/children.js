(function (root, undefined) {

  var NW = 0,
      NE = 1,
      SE = 2,
      SW = 3;

  var EAST = 1,
      NEITHER = 0,
      WEST = -1,
      NORTH = 1,
      SOUTH = -1;


  var _ = root._ || require('../vendor/underscore');
  
  var QuadTree = root.QuadTree || require('./quad-tree').QuadTree,
      Cell     = root.Cell     || require('./quad-tree').Cell

  _.extend(Cell.prototype, {

    generation: function () { return 0; },

    size: function () { return 1; }

  });

  _.extend(QuadTree.prototype, {

    generation: function () {
      return 1 + this.children[0].generation();
    },

    size: function () {
      return this.children[0].size() * 2;
    },

    // NW NE | NW NE
    // SW SE | SW SE
    // -------------
    // NW NE | NW NE
    // SW SE | SW SE

    /*
       .. .. | .. ..
       .. .. | .. ..
             |
       .. .. | .. ..
       .. .. | .. ..
       -------------
       .. .. | .. ..
       .. .. | .. ..
             |
       .. .. | .. ..
       .. .. | .. ..
    */

    // x and y are constrained to N, S, E, W and neither
    subTreeByIndices: function (x, y) {
      if (y === SOUTH) {
        if (x === WEST) {
          return this.sw();
        }
        else if (x === NEITHER) {
          return this.ss();
        }
        else if (x === EAST) {
          return this.se();
        }
      }
      else if (y === NEITHER) {
        if (x === WEST) {
          return this.ww();
        }
        else if (x === NEITHER) {
          return this.cc();
        }
        else if (x === EAST) {
          return this.ee();
        }
      }
      else if (y === NORTH) {
        if (x === WEST) {
          return this.nw();
        }
        else if (x === NEITHER) {
          return this.nn();
        }
        else if (x === EAST) {
          return this.ne();
        }
      }
    },

    // Brute force and sloppy
    // relative to the center of the tree being called
    // given in cells, not pixels
    findTreeEnclosingRectangle: function (upperLeft, lowerRight) {
      //alert("findTreeEnclosingRectangle for " + this.id)
      var size = this.size(),
          extant = Math.floor(size / 2),
          ewIndex,
          nsIndex;

      // Case: doesn't fit at all. redundant check!?
      if (Math.abs(upperLeft.x) > extant) return;
      if (Math.abs(upperLeft.y) > extant) return;
      if (Math.abs(lowerRight.x) > extant) return;
      if (Math.abs(lowerRight.y) > extant) return;

      if (this.generation === 1) return {
                                   bufferTree: this,
                                   fromCenterInCells: {
                                     x: 0,
                                     y: 0
                                   }
                                 };

      var upperLeftRelativeToChild,
          lowerRightRelativeToChild,
          child,
          childOrDescendantInfo,
          childExtant = Math.floor(extant / 2); //Distance to center to child

      // fits, so check children
      // TODO: Check all and return smallest!
      for (nsIndex = -1; nsIndex < 2; ++nsIndex) {
        for (ewIndex = -1; ewIndex < 2; ++ewIndex) {

          upperLeftRelativeToChild = {
            x: upperLeft.x - (ewIndex * childExtant),
            y: upperLeft.y - (nsIndex * childExtant)
          };

          if (Math.abs(upperLeftRelativeToChild.x) > childExtant) continue;
          if (Math.abs(upperLeftRelativeToChild.y) > childExtant) continue;

          lowerRightRelativeToChild = {
            x: lowerRight.x - (ewIndex * childExtant),
            y: lowerRight.y - (nsIndex * childExtant)
          }

          if (Math.abs(lowerRightRelativeToChild.x) > childExtant) continue;
          if (Math.abs(lowerRightRelativeToChild.y) > childExtant) continue;

          child = this.subTreeByIndices(ewIndex, nsIndex);

          childOrDescendantInfo = child.findTreeEnclosingRectangle(upperLeftRelativeToChild, lowerRightRelativeToChild);

          if (childOrDescendantInfo) {
            var r = {
                     bufferTree: childOrDescendantInfo.bufferTree,
                     fromCenterInCells: {
                       x: childOrDescendantInfo.fromCenterInCells.x + (ewIndex * childExtant),
                       y: childOrDescendantInfo.fromCenterInCells.y + (nsIndex * childExtant)
                     }
                   };
            return r;
          }
          alert("WE SHOULD NOT GET HERE");
        }
      }
      //alert("no children fit " + this.id + " of size " + this.size());
      return {
               bufferTree: this,
               fromCenterInCells: {
                 x: 0,
                 y: 0
               }
             };
    }
  });


})(this);