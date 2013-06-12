(function (root) {
  
  var _ = root._ || require('underscore');
  
  var CACHE = {};
  var ID = 100;
  
	function Cell (id) {
	  if (CACHE[id]) return CACHE[id];
    if (!(this instanceof Cell)) return new Cell(id);
	  this.id = id;
	  this.generation = 0;
	  CACHE[id] = this;
	}
  
  _.extend(Cell.prototype, {
    
    flip: function (offset) {
      console.log('flipping cell', this.id, 1-this.id)
      return Cell(1 - this.id);
    },
    
    emptyCopy: function () {
  	  return Cell(0);
  	},
    
    resizeTo: function (generation) {
      return generation === 0
             ? this
             : new QuadTree([this, this, this, this]).resizeTo(generation);
    }
    
  });
  
  function QuadTree (nw_ne_se_sw) {
    var container = CACHE[nw_ne_se_sw[0].id] || (CACHE[nw_ne_se_sw[0].id] = {});
        container = container[nw_ne_se_sw[1].id] || (container[nw_ne_se_sw[1].id] = {});
        container = container[nw_ne_se_sw[2].id] || (container[nw_ne_se_sw[2].id] = {});
    
    return container[nw_ne_se_sw[3].id] || (
      this.id = ++ID,
      this.children = nw_ne_se_sw,
      this.generation = nw_ne_se_sw[0].generation + 1,
      container[nw_ne_se_sw[3].id] = this
    );
  }
  
  _.extend(QuadTree.prototype, {
    
    emptyCopy: function () {
      var emptyChildCopy = this.children[0].emptyCopy();
      return new QuadTree([emptyChildCopy, emptyChildCopy, emptyChildCopy, emptyChildCopy]);
    },
    
    double: function () {
      var emptyChildCopy = this.children[0].emptyCopy();
      return new QuadTree([
        new QuadTree([emptyChildCopy, emptyChildCopy, this.children[0], emptyChildCopy]),
        new QuadTree([emptyChildCopy, emptyChildCopy, emptyChildCopy, this.children[1]]),
        new QuadTree([this.children[2], emptyChildCopy, emptyChildCopy, emptyChildCopy]),
        new QuadTree([emptyChildCopy, this.children[3], emptyChildCopy, emptyChildCopy])
      ]);
    },
    
    flip: function (offset) {
      var x = offset.x,
          y = offset.y,
          grandchildSize,
          childSize;
        
      if (this.generation > 2) {
        grandchildSize = Math.pow(2, this.generation - 2);
        childSize = grandchildSize * 2;
        if (x > childSize) throw "Wrong! " + x + " > " + childSize;
        if (y > childSize) throw "Wrong! " + y + " > " + childSize;
        if (x === 0 || y === 0) throw "Zero";
      }
      else if (this.generation === 2) {
        grandchildSize = 1;
        childSize = 2;
        if (x > childSize) throw "Wrong! " + x + " > " + childSize;
        if (y > childSize) throw "Wrong! " + y + " > " + childSize;
        if (x === 0 || y === 0) throw "Zero";
      }
      else if (this.generation === 1) {
        grandchildSize = 1;
        childSize = 1;
        if (x > childSize) throw "Wrong! " + x + " > " + childSize;
        if (y > childSize) throw "Wrong! " + y + " > " + childSize;
        if (x === 0 || y === 0) throw "Zero";
      }
      else {
        grandchildSize = 0;
      }
        
      if (x < 0 && y < 0) {
        return new QuadTree([
          this.children[0].flip({
            x: removeZero(x + grandchildSize),
            y: removeZero(y + grandchildSize)
          }),
          this.children[1],
          this.children[2],
          this.children[3]
        ]);
      }
      else if (x > 0 && y < 0) {
        return new QuadTree([
          this.children[0],
          this.children[1].flip({
            x: removeZero(x - 1 - grandchildSize),
            y: removeZero(y + grandchildSize)
          }),
          this.children[2],
          this.children[3]
        ]);
      }
      else if (x > 0 && y > 0) {
        return new QuadTree([
          this.children[0],
          this.children[1],
          this.children[2].flip({
            x: removeZero(x - 1 - grandchildSize),
            y: removeZero(y - 1 - grandchildSize)
          }),
          this.children[3]
        ]);
      }
      else if (x < 0 && y > 0) {
        return new QuadTree([
          this.children[0],
          this.children[1],
          this.children[2],
          this.children[3].flip({
            x: removeZero(x + grandchildSize),
            y: removeZero(y - 1 - grandchildSize)
          })
        ]);
      }
      else throw "unhandled"
    
      //////////
    
      function removeZero (n) {
        return n < 0
               ? n
               : n + 1;
      }
    },
    
    resizeTo: function (generation) {
      if (this.generation > generation) throw "implement me";
      var resized = this;
      while (resized.generation < generation) {
        resized = resized.double();
      }
      return resized;
    }
    
  });
  
  _.extend(root, {
    QuadTree: QuadTree,
    Cell: Cell
  });
  
})(this);