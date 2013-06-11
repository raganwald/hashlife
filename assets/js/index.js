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
    
    vCanvas.bind('mousedown', onDragStart);
      
    $(window)
      .resize(draw)
      .trigger("resize");
      
    ///////////////////////////////////////////////////////////////////

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

    function draw () {
      
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
        relativeScroll.y > (bufferCanvas.height - vCanvas.height)
      ) {
        upperLeft = {
          x: _scrollFromCenter.x - (vCanvas.width / 2),
          y: _scrollFromCenter.y - (vCanvas.width / 2)
        };
        lowerRight = {
          x: _scrollFromCenter.x + (vCanvas.width / 2),
          y: _scrollFromCenter.y + (vCanvas.width / 2)
        };
        
        // console.log('getting buffer info', relativeScroll.x, relativeScroll.y);
        
        bufferInfo = root.universe.bufferInfo(upperLeft, lowerRight);
    
        while (bufferInfo == null) {
          // console.log('double!');
          root.universe = root.universe.double();
          bufferInfo =  root.universe.bufferInfo(upperLeft, lowerRight);
        }
        bufferTree = bufferInfo.bufferTree;
        bufferCanvas = bufferTree.canvas();
        _bufferFromCenter = bufferInfo.fromCenter;
        
        // console.log("Buffer is now", _bufferFromCenter.x, _bufferFromCenter.y);
        
        relativeScroll = {
          x: ((bufferCanvas.width - vCanvas.width) / 2 ) - _scrollFromCenter.x + _bufferFromCenter.x,
          y: ((bufferCanvas.height - vCanvas.height)/ 2 ) - _scrollFromCenter.y + _bufferFromCenter.y
        }
        
        // console.log("relativeScroll", relativeScroll.x, relativeScroll.y);
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

// (function (root) {
//   
//   var windowElement,
//       vpElement,
//       viewportDOMElement,
//       viewportContext,
//       buffer,
//       _scrollMax,
//       _scroll,
//       _limits,
//       INITIAL_SCALE = 8;
// 
//   function init() {
//     
//     console.log("!", viewport);
//     
//       // Get DOM elements
//       windowElement = $(window);
//       vpElement = $('canvas#viewport');
//       viewportDOMElement = vpElement[0];
//       viewportContext = viewportDOMElement.getContext("2d");
//       
//       viewportDOMElement.height = window.innerHeight;
//       viewportDOMElement.width = window.innerWidth;
//       
//       root.universe = EmptyQuadTree(4, Cell(1)).double().double().double().double().double();
//       
//       buffer = $buffer = root.universe.canvas();
//       
//       _scroll = {
//         x: (buffer.width / 2) - (viewportDOMElement.width / 2),
//         x: (buffer.height / 2) - (viewportDOMElement.height / 2)
//       }
//     
//       _limits = {
//         upperLeft: {
//           x: viewportDOMElement.width / 2,
//           y: viewportDOMElement.height / 2
//         },
//         lowerRight: {
//           x: buffer.width - (viewportDOMElement.width / 2),
//           y: buffer.height - (viewportDOMElement.height / 2)
//         }
//       };
//       
//       console.log("buffer", buffer.height, buffer.width, viewportDOMElement.height, viewportDOMElement.width)
//       console.log("limits", _limits)
//       
//       // getBufferInfo({
//       //   x: -(viewportDOMElement.width / 2),
//       //   y: -(viewportDOMElement.height / 2)
//       // }, {
//       //   x: (viewportDOMElement.width / 2),
//       //   y: (viewportDOMElement.height / 2)
//       // });
//       /*
//        * Setup drag listening for viewport canvas to scroll over buffer canvas
//        */                 
//       function onDragging(event){
//           var delta = {
//               left : (event.clientX - event.data.lastCoord.left),
//               top : (event.clientY - event.data.lastCoord.top)
//           };
// 
//           _scroll.x = _scroll.x - delta.left;
// /*
//           if (dx < 0) {
//               _scroll.x = 0;
//           } else if (dx > _scrollMax.x) {
//               _scroll.x = _scrollMax.x;
//           } else {
//               _scroll.x = dx;
//           }
// */
//           _scroll.y = _scroll.y - delta.top;
// /*
//           if (dy < 0) {
//               _scroll.y = 0;
//           } else if (dy > _scrollMax.y) {
//               _scroll.y = _scrollMax.y;
//           } else {
//               _scroll.y = dy;
//           }
// */
//           event.data.lastCoord = {
//               left : event.clientX,
//               top : event.clientY
//           }
// 
//           draw();
//       }
//       
//       function centerView () {
//         var down = Math.floor((buffer.height - viewportDOMElement.height) / 2),
//             right = Math.floor((buffer.width - viewportDOMElement.width) / 2);
//             
//         _scroll.x = right;
//         _scroll.y = down;
//       }
// 
//       function onDragEnd(){
//           $(document).unbind("mousemove", onDragging);
//           $(document).unbind("mouseup", onDragEnd);
//       }
// 
//       function onDragStart(event){
//           event.data = {
//               lastCoord:{
//                   left : event.clientX,
//                   top : event.clientY
//               }
//           };
//           $(document).bind("mouseup", event.data, onDragEnd);
//           $(document).bind("mousemove", event.data, onDragging);
//       }               
//       vpElement.bind('mousedown', onDragStart);
// 
//       /*
//        * Draw initial view of buffer canvas onto viewport canvas
//        */ 
//       centerView();
//       windowElement.resize(draw);
//       windowElement.trigger("resize");
//       
//   }
// 
//   function draw() {
//       viewportDOMElement.width = windowElement.width();
//       viewportDOMElement.height = windowElement.height();
// 
//       if(!_scrollMax){
//           _scrollMax = {
//               x: $buffer.width - viewportDOMElement.width,
//               y: $buffer.height - viewportDOMElement.height
//           }
//       }
//       
//       console.log(viewport);
// 
//       viewportContext.drawImage(buffer, _scroll.x, _scroll.y, viewportDOMElement.width, viewportDOMElement.height, 0, 0, viewportDOMElement.width, viewportDOMElement.height);
//       
//       $('#x').html(_scroll.x);
//       $('#y').html(_scroll.y);
//       
//       if (_scroll.x < _limits.upperLeft.x ||
//           _scroll.y < _limits.upperLeft.y ||
//           (_scroll.x + viewportContext.width) > _limits.lowerRight.x ||
//           (_scroll.y + viewportContext.height) > _limits.lowerRight.y) {
//         console.log("Boing!", _scroll, _limits)
//         // getBufferInfo(_scroll, {
//         //   x: _scroll.x + viewport.width,
//         //   y: _scroll.y + viewport.height
//         // })
//       }
//   }
// 
  // function getBufferInfo (upperLeft, lowerRight) {
  //   var bufferInfo = $bufferInfo = root.universe.bufferInfo(upperLeft, lowerRight);
  //   
  //   while (bufferInfo == null) {
  //     console.log('double!');
  //     root.universe = root.universe.double();
  //     bufferInfo = $bufferInfo = root.universe.bufferInfo(upperLeft, lowerRight);
  //   }
  //   
  //   buffer = bufferInfo.buffer.canvas();
  //   
  //   _limits = {
  //     lower: {
  //       x: viewportDOMElement.width / 2,
  //       y: viewportDOMElement.height / 2
  //     },
  //     upper: {
  //       x: buffer.width - (viewportDOMElement.width / 2),
  //       y: buffer.height - (viewportDOMElement.height / 2)
  //     }
  //   };
  //   
  //   console.log("BI", bufferInfo)
  //   
  //   _scroll = {
  //     x: (buffer.width / 2) - (viewportDOMElement.width / 2),
  //     y: (buffer.height / 2) - (viewportDOMElement.height / 2)
  //   }
  //   
  // }
//   
//   var LOG2 = Math.log(2);
//   
//   function MinimumSquareEnclosing(height, width) {
//     var length = Math.ceil(Math.max(height, width) / CELL_SIZE_PX),
//         log2 = Math.log(length)/LOG2,
//         generation = Math.ceil(log2),
//         qt = EmptyQuadTree(generation, Cell(1));
//         
//     return qt;
//   }
// 
//   $(document).ready(init);
//         
//         
// })(this);