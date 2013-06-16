(function (root) {
  
  var LOG2 = Math.log(2);
  
  $(document).ready(function () {
    
    // viewport
    var vCanvas = $('canvas#viewport'),
        vContext = vCanvas[0].getContext("2d");
    
    vCanvas.height = window.innerHeight;
    vCanvas.width = window.innerWidth;
    
    // the buffer within the universe
    var length = Math.ceil(Math.max(window.innerHeight, window.innerWidth) / Cell.size()),
        log2 = Math.log(length)/LOG2,
        bufferGeneration = Math.ceil(log2),
        bufferTree = Cell(0).resizeTo(bufferGeneration),
        bufferCanvas = bufferTree.canvas();
        
    // the universe
    root.universe = bufferTree.double().double();
    
    // scroll is relative to the center of the universe
    var _scrollFromCenter = { x: 0, y: 0 },
        _bufferUpperLeftFromUniverseCenter = { x: -(bufferTree.canvasSize() / 2), y: -(bufferTree.canvasSize() / 2) };
        _bufferLowerRightFromUniverseCenter = { x: (bufferTree.canvasSize() / 2), y: (bufferTree.canvasSize() / 2) };
    
    var findBufferTree = (function (upperLeft, lowerRight) {
      return root.universe.findTreeEnclosingRectangle(upperLeft, lowerRight);
    });
    
    vCanvas
      .bind('mousedown', onDragStart)
      .dblclick(flipCell);
      
    $(document)
      .keypress(onKeypess);
      
    $(window)
      .resize(draw)
      .trigger("resize");
      
    ///////////////////////////////////////////////////////////////////
    
    function onKeypess (event) {
      if (event.which === 43) {
        console.log('zoom in', bufferTree.generation);
        Cell.size(Cell.size() * 2);
        // _scrollFromCenter = {
        //   x: _scrollFromCenter.x * 2,
        //   y: _scrollFromCenter.y * 2
        // }
        draw(true);
        console.log('zoomed in', bufferTree.canvasSize());
      }
      else if (event.which === 45) {
        console.log('zoom out', bufferTree.canvasSize());
        if (root.Cell.size() >= 2) {
          Cell.size(Cell.size() / 2);
          // _scrollFromCenter = {
          //   x: _scrollFromCenter.x / 2,
          //   y: _scrollFromCenter.y / 2
          // }
          draw(true);
          console.log('zoomed out', bufferTree.canvasSize());
        }
      }
      else return void 0;
    }
    
    function noZero (n) {
      return Math.floor(n >= 0
                        ? n + 1
                        : n
             );
    }
    
    function flipCell (event) {
      
      var relativeToUniverseCenterInCells = {
        x: noZero((_scrollFromCenter.x - (vCanvas.width / 2) + event.clientX) / Cell.size()),
        y: noZero((_scrollFromCenter.y - (vCanvas.height / 2) + event.clientY) / Cell.size())
      };
      
      root.universe = root.universe.flip(relativeToUniverseCenterInCells);
      
      draw(true);
    }

    function onDragStart (event) {
      event.data = {
        lastCoord:{
          left : event.clientX,
          top : event.clientY
        }
      };
    
      $(document)
        .bind("mouseup", event.data, onDragEnd)
        .bind("mousemove", event.data, onDragging);
        
     document.body.style.cursor = 'all-scroll';
    }     
           
    function onDragging (event) {
      var delta = {
          left : (event.clientX - event.data.lastCoord.left),
          top : (event.clientY - event.data.lastCoord.top)
      };

      _scrollFromCenter.x = _scrollFromCenter.x - delta.left;
      _scrollFromCenter.y = _scrollFromCenter.y - delta.top;
    
      event.data.lastCoord = {
        left : event.clientX,
        top : event.clientY
      };

      draw();
    }
  
    function onDragEnd () {
      $(document)
        .unbind("mousemove", onDragging)
        .unbind("mouseup", onDragEnd);
        
     document.body.style.cursor = 'pointer';
    }

    function draw (force) {
      
      //synchronize window and canvas dimensions
      vCanvas[0].width = $(window).width();
      vCanvas[0].height = $(window).height();
      
      var bufferInfo,
          upperLeftInPixels = {
            x: _scrollFromCenter.x - (vCanvas[0].width / 2),
            y: _scrollFromCenter.y - (vCanvas[0].height / 2)
          },
          // in pixels
          lowerRightInPixels = {
            x: _scrollFromCenter.x + (vCanvas[0].width / 2),
            y: _scrollFromCenter.y + (vCanvas[0].height / 2)
          },
          relativeScroll = {
            x: upperLeftInPixels.x - _bufferUpperLeftFromUniverseCenter.x,
            y: upperLeftInPixels.y - _bufferUpperLeftFromUniverseCenter.y 
          };
          
      if (
        upperLeftInPixels.x < _bufferUpperLeftFromUniverseCenter.x ||
        upperLeftInPixels.y < _bufferUpperLeftFromUniverseCenter.y ||
        lowerRightInPixels.x > _bufferLowerRightFromUniverseCenter.x ||
        lowerRightInPixels.y > _bufferLowerRightFromUniverseCenter.y ||
        force
      ) {
        force = false;
        
        upperLeftInCells = {
          x: Math.floor(upperLeftInPixels.x / Cell.size()),
          y: Math.floor(upperLeftInPixels.y / Cell.size())
        };
        lowerRightInCells = {
          x: Math.ceil(lowerRightInPixels.x / Cell.size()),
          y: Math.ceil(lowerRightInPixels.y / Cell.size())
        };
        
        bufferInfo = findBufferTree(upperLeftInCells, lowerRightInCells);
    
        while (bufferInfo == null) {
          root.universe = root.universe.double();
          bufferInfo = findBufferTree(upperLeftInCells, lowerRightInCells);
        }
        
        bufferTree = bufferInfo.bufferTree;
        bufferCanvas = bufferTree.canvas();
        
        var bufferExtant = bufferTree.canvasSize() / 2,
            fromCenterInPixels = {
              x: bufferInfo.fromCenterInCells.x * Cell.size(),
              y: bufferInfo.fromCenterInCells.y * Cell.size()
            };
        
        _bufferUpperLeftFromUniverseCenter = { 
          x: fromCenterInPixels.x - bufferExtant, 
          y: fromCenterInPixels.y - bufferExtant
        };
        _bufferLowerRightFromUniverseCenter = { 
          x: fromCenterInPixels.x + bufferExtant, 
          y: fromCenterInPixels.y + bufferExtant 
        };
        relativeScroll = {
          x: upperLeftInPixels.x - _bufferUpperLeftFromUniverseCenter.x,
          y: upperLeftInPixels.y - _bufferUpperLeftFromUniverseCenter.y 
        };
        
        if (
          upperLeftInPixels.x < _bufferUpperLeftFromUniverseCenter.x ||
          upperLeftInPixels.y < _bufferUpperLeftFromUniverseCenter.y ||
          lowerRightInPixels.x > _bufferLowerRightFromUniverseCenter.x ||
          lowerRightInPixels.y > _bufferLowerRightFromUniverseCenter.y 
        ) {
          console.log(upperLeftInCells.x, upperLeftInCells.y, bufferInfo.fromCenter.x, bufferInfo.fromCenter.y)
          throw 'something';
        }
        
      }
        
      vContext.drawImage(bufferCanvas, relativeScroll.x, relativeScroll.y, vCanvas[0].width, vCanvas[0].height, 0, 0, vCanvas[0].width, vCanvas[0].height)
    }
  
});

})(this);