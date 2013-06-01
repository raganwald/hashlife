(function (root, $, undefined) {
  
  var _ = root._ || require('underscore');
  
  var CACHE = {};
  var ID = 100;
  
  function QuadTree (nw_ne_se_sw) {
    var container = CACHE[nw_ne_se_sw[0].id] || (CACHE[nw_ne_se_sw[0].id] = {});
        container = container[nw_ne_se_sw[1].id] || (container[nw_ne_se_sw[1].id] = {});
        container = container[nw_ne_se_sw[2].id] || (container[nw_ne_se_sw[2].id] = {});
    
    return container[nw_ne_se_sw[3].id] || (
      this.id = ++ID,
      this.children = nw_ne_se_sw,
      container[nw_ne_se_sw[3].id] = this
    );
  }
	
	function Cell (id) {
	  if (CACHE[id]) return CACHE[id];
    if (!(this instanceof Cell)) return new Cell(id);
	  this.id = id;
	  CACHE[id] = this;
	}
  
  function Leaf (nw_ne_se_sw) {
    var id = 2 + nw_ne_se_sw[0].id + (2 * nw_ne_se_sw[1].id) + (4 * nw_ne_se_sw[2].id) + (8 * nw_ne_se_sw[3].id);
    if (CACHE[id]) return CACHE[id];
    if (!(this instanceof Leaf)) return new Leaf(nw_ne_se_sw);
    this.id = id;
    this.children = nw_ne_se_sw;
    CACHE[id] = this;
  }
  
  function EmptyQuadTree (generation) {
    if (generation === 0) return Cell(0);
    else if (generation === 1) return Leaf([Cell(0), Cell(0), Cell(0), Cell(0)]);
    else {
      var oneless = EmptyQuadTree(generation - 1);
      return new QuadTree([oneless, oneless, oneless, oneless]);
    }
  }
  
  _.extend(window, {
    QuadTree: QuadTree,
    EmptyQuadTree: EmptyQuadTree,
    Leaf: Leaf,
    Cell: Cell
  })
  
})(this, jQuery);