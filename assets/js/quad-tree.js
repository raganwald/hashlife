(function (root) {
  
  var _ = root._ || require('../vendor/underscore');
  
  var QUAD_TREE_CACHE = {};
  var ALIVE = DEAD = void 0;
  var ID = 100;
  
	function Cell (id) {
	  if (id === 0) {
	    if (DEAD) return DEAD;
      if (!(this instanceof Cell)) return new Cell(id);
      DEAD = this;
	  }
	  else if (id === 1) {
	    if (ALIVE) return ALIVE;
	    if (!(this instanceof Cell)) return new Cell(id);
	    ALIVE = this;
	  }
	  this.id = id;
	  this.generation = 0;
	  this.population = id;
	}
  
  _.extend(Cell.prototype, {
    
    flip: function (offset) {
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
    if (!(this instanceof QuadTree)) return new QuadTree(nw_ne_se_sw);
    
    if(!_.all(nw_ne_se_sw, function (child) { return child instanceof QuadTree || child instanceof Cell; })) throw "BAD";
    
    var container = QUAD_TREE_CACHE[nw_ne_se_sw[0].id] || (QUAD_TREE_CACHE[nw_ne_se_sw[0].id] = {});
        container = container[nw_ne_se_sw[1].id] || (container[nw_ne_se_sw[1].id] = {});
        container = container[nw_ne_se_sw[2].id] || (container[nw_ne_se_sw[2].id] = {});
    
    return container[nw_ne_se_sw[3].id] || (
      this.id = ++ID,
      this.children = nw_ne_se_sw,
      this.population = _.reduce(_.pluck(nw_ne_se_sw, 'population'), function (x, y) { return x + y; }, 0),
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
        resized = new QuadTree([resized, resized, resized, resized]);
      }
      return resized;
    }
    
  });
  
  _.extend(root, {
    QuadTree: QuadTree,
    Cell: Cell
  });
  
})(this);