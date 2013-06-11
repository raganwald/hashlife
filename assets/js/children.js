(function (root, $, undefined) {
  
  var NW = 0,
      NE = 1,
      SE = 2,
      SW = 3;
      
  var EAST = 1,
      NEITHER = 0,
      WEST = -1,
      NORTH = 1,
      SOUTH = -1;
      
  
  var _ = root._ || require('underscore');
  
  Cell.prototype.generation = function () {
    return 0;
  }
  
  QuadTree.prototype.generation = function () {
    return 1 + this.children[0].generation();
  }
	
	QuadTree.prototype.size = function () { this.children[0].size() * 2; }
	
	Cell.prototype.size = function () { return 1; }
  
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
  QuadTree.prototype.subTreeByIndices = function (x, y) {
    if (y === SOUTH) {
      if (x === WEST) {
        return this.children[SW];
      }
      else if (x === NEITHER) {
        return new QuadTree([
          this.children[SW].children[NE],
          this.children[SE].children[NW],
          this.children[SE].children[SW],
          this.children[SW].children[SE]
        ]);
      }
      else if (x === EAST) {
        return this.children[SE];
      }
    }  
    else if (y === NEITHER) {
      if (x === WEST) {
        return new QuadTree([
          this.children[NW].children[SW],
          this.children[NW].children[SE],
          this.children[SW].children[NE],
          this.children[SW].children[NW]
        ]);
      }
      else if (x === NEITHER) {
        return new QuadTree([
          this.children[NW].children[SE],
          this.children[NE].children[SW],
          this.children[SE].children[NW],
          this.children[SW].children[NE]
        ]);
      }
      else if (x === EAST) {
        return new QuadTree([
          this.children[NE].children[SW],
          this.children[NE].children[SE],
          this.children[SE].children[NE],
          this.children[SE].children[NW]
        ]);
      }
    }
    else if (y === NORTH) {
      if (x === WEST) {
        return this.children[NW];
      }
      else if (x === NEITHER) {
        return new QuadTree([
          this.children[NW].children[NE],
          this.children[NE].children[NW],
          this.children[NW].children[SE],
          this.children[NW].children[SW]
        ]);
      }
      else if (x === EAST) {
        return this.children[NE];
      }
    }
  };
  
  // Brute force and sloppy
  QuadTree.prototype.bufferInfo = function (upperLeft, lowerRight) {
    var currentSquare = this,
        size = this.canvasSize(),
        viewportSize = Math.max(Math.abs(lowerRight.x - upperLeft.x), Math.abs(lowerRight.y - upperLeft.y)),
        halfChildSize = size / 4,
        nsIndex,
        ewIndex,
        childTopLeft,
        childBottomRight,
        child,
        descendantInfo;
        
    // Case: doesn't fit at all
    if (Math.abs(upperLeft.x) >size) return;
    if (Math.abs(upperLeft.y) >size) return;
    if (Math.abs(lowerRight.x) >size) return;
    if (Math.abs(lowerRight.y) >size) return;
    
    // Case: isn't double the size
    if (size < (viewportSize * 2)) return;
    
    // children
    for (nsIndex = -1; nsIndex < 2; ++nsIndex) {
      for (ewIndex = -1; ewIndex < 2; ++ewIndex) {
        childTopLeft = {
          x: (ewIndex - 1) * halfChildSize,
          y: (nsIndex - 1) * halfChildSize
        };
        childBottomRight = {
          x: (ewIndex + 1) * halfChildSize,
          y: (nsIndex + 1) * halfChildSize
        }
        if (upperLeft.x >= childTopLeft.x &&
            upperLeft.y >= childTopLeft.y &&
            lowerRight.x <= childBottomRight.x &&
            lowerRight.y <= childBottomRight.y) {
          child = this.subTreeByIndices(ewIndex, nsIndex);
          upperLeft = {
            x: upperLeft.x - childTopLeft.x,
            y: upperLeft.y - childTopLeft.y
          };
          lowerRight = {
            x: lowerRight.x - childTopLeft.x,
            y: lowerRight.y - childTopLeft.y
          }
          descendantInfo = child.bufferInfo(upperLeft, lowerRight);
          return descendantInfo
                 ? descendantInfo
                 : {
                     bufferTree: child,
                     fromCenter: {
                       x: ((childBottomRight.x + childTopLeft.x) / 2),
                       y: ((childBottomRight.y + childTopLeft.y) / 2)
                     }
                   };
        }
      }
    }
  }
  
  
})(this, jQuery);