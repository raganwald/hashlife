(function (root) {
  
  var LOG2 = Math.log(2);
  
  $(document).ready(function () {
    
    // viewpoet
    var vCanvas = $('canvas#viewport'),
        vContext = vCanvas[0].getContext("2d");
    
    vCanvas.height = window.innerHeight;
    vCanvas.width = window.innerWidth;
    
    // the buffer within the universe
    var length = Math.ceil(Math.max(window.innerHeight, window.innerWidth) / CELL_SIZE_PX),
        log2 = Math.log(length)/LOG2,
        bufferGeneration = Math.ceil(log2),
        bufferTree = EmptyQuadTree(4, Cell(1)),
        bufferCanvas = bufferTree.canvas();
        
    // the universe
    root.universe = bufferTree.double().double();
    
    // scroll is relative to the center of the universe
    var _scrollFromCenter = { x: 0, y: 0 },
        _bufferFromCenter = { x: 0, y: 0 };
    
    vCanvas
      .bind('mousedown', onDragStart)
      .dblclick(onClick);
      
    $(window)
      .resize(draw)
      .trigger("resize");
      
    ///////////////////////////////////////////////////////////////////
    
    function onClick (event) {
      
      // TODO: incorporate _scroll!!!!!!!!!
      
      var relativeToBuffer = {
        x: Math.floor((_bufferFromCenter.x - (vCanvas.width / 2) + event.clientX) / CELL_SIZE_PX),
        y: Math.floor((_bufferFromCenter.y - (vCanvas.height / 2) + event.clientY) / CELL_SIZE_PX)
      };
      
      relativeToBuffer.x = relativeToBuffer.x >= 0
                           ? relativeToBuffer.x + 1
                           : relativeToBuffer.x;
      
      relativeToBuffer.y = relativeToBuffer.y >= 0
                           ? relativeToBuffer.y + 1
                           : relativeToBuffer.y;
                           
      if (relativeToBuffer.x === 0) throw "BAD x";
      if (relativeToBuffer.y === 0) throw "BAD y";
      
      root.universe = root.universe.flip(relativeToBuffer);
      
      console.log(root.universe);
      
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

      _scrollFromCenter.x = _scrollFromCenter.x + delta.left;
      _scrollFromCenter.y = _scrollFromCenter.y + delta.top;
    
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
      
      force = !!force;
      
      vCanvas[0].width = $(window).width();
      vCanvas[0].height = $(window).height();
      
      var bufferInfo,
          upperLeft, 
          lowerRight,
          relativeScroll = {
            x: ((bufferCanvas.width - vCanvas.width) / 2 ) - _scrollFromCenter.x + _bufferFromCenter.x,
            y: ((bufferCanvas.height - vCanvas.height)/ 2 ) - _scrollFromCenter.y + _bufferFromCenter.y
          };
      
      while (
        relativeScroll.x < 0 ||
        relativeScroll.x > (bufferCanvas.width - vCanvas.width) ||
        relativeScroll.y < 0 ||
        relativeScroll.y > (bufferCanvas.height - vCanvas.height) ||
        force
      ) {
        force = false;
        upperLeft = {
          x: _scrollFromCenter.x - (vCanvas.width / 2),
          y: _scrollFromCenter.y - (vCanvas.width / 2)
        };
        lowerRight = {
          x: _scrollFromCenter.x + (vCanvas.width / 2),
          y: _scrollFromCenter.y + (vCanvas.width / 2)
        };
        // 
        // console.log('getting buffer info', relativeScroll.x, relativeScroll.y);
        
        bufferInfo = root.universe.bufferInfo(upperLeft, lowerRight);
    
        while (bufferInfo == null) {
          // console.log('double!');
          root.universe = root.universe.double();
          bufferInfo = root.universe.bufferInfo(upperLeft, lowerRight);
        }
        bufferTree = bufferInfo.bufferTree;
        bufferCanvas = bufferTree.canvas();
        _bufferFromCenter = bufferInfo.fromCenter;
        
        // console.log("Buffer is now", _bufferFromCenter.x, _bufferFromCenter.y);
        
        relativeScroll = {
          x: ((bufferCanvas.width - vCanvas.width) / 2 ) - _scrollFromCenter.x + _bufferFromCenter.x,
          y: ((bufferCanvas.height - vCanvas.height)/ 2 ) - _scrollFromCenter.y + _bufferFromCenter.y
        }
        
        console.log("relativeScroll", relativeScroll.x, relativeScroll.y);
      } 
      vContext.drawImage(bufferCanvas, relativeScroll.x, relativeScroll.y, vCanvas.width, vCanvas.height, 0, 0, vCanvas.width, vCanvas.height);
    }   

  function getBufferInfo (upperLeft, lowerRight) {
    var bufferInfo = $bufferInfo = root.universe.bufferInfo(upperLeft, lowerRight);
    
    while (bufferInfo == null) {
      console.log('double!');
      root.universe = root.universe.double();
      bufferInfo = $bufferInfo = root.universe.bufferInfo(upperLeft, lowerRight);
    }
    
    buffer = bufferInfo.bufferTree.canvas();
    
    _limits = {
      lower: {
        x: viewportDOMElement.width / 2,
        y: viewportDOMElement.height / 2
      },
      upper: {
        x: buffer.width - (viewportDOMElement.width / 2),
        y: buffer.height - (viewportDOMElement.height / 2)
      }
    };
    
    _scroll = {
      x: (buffer.width / 2) - (viewportDOMElement.width / 2),
      y: (buffer.height / 2) - (viewportDOMElement.height / 2)
    }
    
  }
  
});

})(this);