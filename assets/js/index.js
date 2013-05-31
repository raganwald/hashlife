(function (root) {
  
  var $window; 
  var img;
  var $viewport; var viewport; var viewportContext;
  var _scroll = {
      x : 0,
      y : 0
  };
  var _scrollMax;

  function init() {
      // Get DOM elements
      $window = $(window);
      $viewport = $('canvas#viewport');
      viewport = $viewport[0];
      viewportContext = viewport.getContext("2d");
      
      $universe = MinimumSquareEnclosing(viewport.width, viewport.height);
      universe = $universe.canvas();
      
      console.log("SOURCE", universe)
      
      /*
       * Setup drag listening for viewport canvas to scroll over universe canvas
       */                 
      function onDragging(event){
          var delta = {
              left : (event.clientX - event.data.lastCoord.left),
              top : (event.clientY - event.data.lastCoord.top)
          };

          _scroll.x = _scroll.x - delta.left;
/*
          if (dx < 0) {
              _scroll.x = 0;
          } else if (dx > _scrollMax.x) {
              _scroll.x = _scrollMax.x;
          } else {
              _scroll.x = dx;
          }
*/
          _scroll.y = _scroll.y - delta.top;
/*
          if (dy < 0) {
              _scroll.y = 0;
          } else if (dy > _scrollMax.y) {
              _scroll.y = _scrollMax.y;
          } else {
              _scroll.y = dy;
          }
*/
          event.data.lastCoord = {
              left : event.clientX,
              top : event.clientY
          }

          draw();
      }
      
      function centerView () {
        var down = Math.floor((universe.height - viewport.height) / 2),
            right = Math.floor((universe.width - viewport.width) / 2);
            
        _scroll.x = right;
        _scroll.y = down;
      }

      function onDragEnd(){
          $(document).unbind("mousemove", onDragging);
          $(document).unbind("mouseup", onDragEnd);
      }

      function onDragStart(event){
          event.data = {
              lastCoord:{
                  left : event.clientX,
                  top : event.clientY
              }
          };
          $(document).bind("mouseup", event.data, onDragEnd);
          $(document).bind("mousemove", event.data, onDragging);
      }               
      $viewport.bind('mousedown', onDragStart);

      /*
       * Draw initial view of universe canvas onto viewport canvas
       */ 
       centerView();
      $window.resize(draw);
      $window.trigger("resize");
      
  }

  function draw() {
      viewport.width = $window.width();
      viewport.height = $window.height();

      if(!_scrollMax){
          _scrollMax = {
              x: universe.width - viewport.width,
              y: universe.height - viewport.height
          }
      }

      viewportContext.drawImage(universe, _scroll.x, _scroll.y, viewport.width, viewport.height, 0, 0, viewport.width, viewport.height);
      $('#x').html(_scroll.x);
      $('#y').html(_scroll.y);
      
      console.log("DRAW",universe, _scroll.x, _scroll.y, viewport.width, viewport.height, 0, 0, viewport.width, viewport.height)
  }


  $(document).ready(init);
        
        
})(this);