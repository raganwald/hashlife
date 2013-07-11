(function (root) {

  var LOG2 = Math.log(2),
  
  after = function(decoration) {
    return function(base) {
      return function() {
        var __value__;
        decoration.call(this, __value__ = base.apply(this, arguments));
        return __value__;
      };
    };
  };

  $(document).ready(function () {
    
    var WE_ARE_MOBILE = !!$('html.touch').length,
        DURATION_THRESHOLD = 1000,
        MIN_SWIPE_LENGTH = 75,
        MAX_SWIPE_WIDTH = 35,
        THROTTLE_MILLIS = WE_ARE_MOBILE
                          ? 25
                          : 10;

    var draw = _.throttle( function () {

      //synchronize window and canvas dimensions
      viewPortCanvas.width = $(window).width();
      viewPortCanvas.height = $(window).height();
      
      while (universe.doesNotEnclose({
        cellSize: Cell.size(),
        viewPort: {
          height: viewPortCanvas.height,
          width: viewPortCanvas.width,
          offset: viewportOffset
        }
      })) universe = universe.double();

      universe.drawInto({
        cellSize: Cell.size(),
        canvas: viewPortCanvas,
        context: viewportContext,
        offset: viewportOffset
      });
      
      $('#generation').text(addCommas(currentGeneration));
      $('#population').text(addCommas(universe.population));
      $('#width').text(addCommas(universe.trimmed().width));
      
    }, THROTTLE_MILLIS);
    
    var triggersRedraw = after(draw);
    
    // offline hack
    if (window.location.protocol === "file:")
      $('#ribbon').hide();

    // viewport
    var canvasProxy = $('canvas#viewport'),
        viewPortCanvas = canvasProxy[0],
        viewportContext = viewPortCanvas.getContext("2d"),
        viewportOffset = { x: 0, y: 0 },
        lastMousePosition = { x: 0, y: 0 };

    viewPortCanvas.height = window.innerHeight;
    viewPortCanvas.width = window.innerWidth;

    // the universe
    var universe = new QuadTree();
    var currentGeneration = 0;
    
    ///////////////////////////////////////////////////////////////////
    
    var panLeft = triggersRedraw( function () {
      viewportOffset.x -= viewPortCanvas.width;
    });
    
    var panRight = triggersRedraw( function () {
      viewportOffset.x += viewPortCanvas.width;
    });
    
    var panUp = triggersRedraw( function () {
      viewportOffset.y -= viewPortCanvas.height;
    });
    
    var panDown = triggersRedraw( function () {
      viewportOffset.y += viewPortCanvas.height;
    });
    
    var rotateUniverse = triggersRedraw( function () {
      universe = universe.rotate();
    });
    
    var rotateUniverseCounterClockwise = triggersRedraw( function () {
      universe = universe.rotate().rotate().rotate();
    });

    var advance = triggersRedraw( function () {
      var thisGenerationRulesTheNation = universe.generation;
      universe = universe
                        .trimmed()
                        .double()
                        .double();
                        
      currentGeneration = currentGeneration + (universe.size() / 2);
      
      universe = universe
                        .future()
                        .trimmed();
    });

    var zoomIn = triggersRedraw( function () {
      Cell.size(Cell.size() * 2);
    });

    var zoomOut = triggersRedraw( function () {
      if (root.Cell.size() >= 2) {
        Cell.size(Cell.size() / 2);
      }
    });

    function noZero (n) {
      return Math.floor(n >= 0
                        ? n + 1
                        : n
             );
    }

    var insert = triggersRedraw( function (what) {

      var relativeToUniverseCenterInCells = {
            x: noZero((viewportOffset.x - (viewPortCanvas.width / 2) + lastMousePosition.x) / Cell.size()),
            y: noZero((viewportOffset.y - (viewPortCanvas.height / 2) + lastMousePosition.y) / Cell.size())
          },
          pasteContent = QuadTree.Library[what];

      universe = universe.paste(pasteContent, relativeToUniverseCenterInCells.x, relativeToUniverseCenterInCells.y)

    });

    var flipCell = triggersRedraw( function (event) {

      var relativeToUniverseCenterInCells = {
        x: noZero((viewportOffset.x - (viewPortCanvas.width / 2) + event.clientX) / Cell.size()),
        y: noZero((viewportOffset.y - (viewPortCanvas.height / 2) + event.clientY) / Cell.size())
      };

      universe = universe.flip(relativeToUniverseCenterInCells);
      
    });
      
    ///////////////////////////////////////////////////////////////////
      
    if (WE_ARE_MOBILE) {

      $(document)
        // .bind("touchmove", function (e) { event.preventDefault(); })
        // .bind("touchstart", touchStart)
        .bind('gesturestart', gestureStart);
        
      canvasProxy
        .bind("swipe", function (e) { console.log("swiper, no swiping", e); })
        .bind("swipeleft", advance);
        .bind("taphold", function () { insert('GosperGliderGun'); });
      
      Cell.size(32);
    
    }
    else Cell.size(16);
    
    function touchStart (event) {
      
      var startCoord = {
            left: event.originalEvent.pageX,
            top: event.originalEvent.pageY
          },
          lastCoord = {
            left: event.originalEvent.pageX,
            top: event.originalEvent.pageY
          },
          touchTime = new Date().getTime();
        
      function touchEnd (event) {
        
        $(document)
          .unbind('touchmove', touchMove)
          .unbind('touchend', touchEnd);
          
        if (new Date().getTime() - touchTime < DURATION_THRESHOLD) {
         if (
           Math.abs( startCoord.left - lastCoord.left ) > MIN_SWIPE_LENGTH &&
           Math.abs( startCoord.top - lastCoord.top ) < MAX_SWIPE_WIDTH
          ) {
           $(event.currentTarget)
            .trigger( "swipe" )
            .trigger( startCoord.left > lastCoord.left ? "swipeleft" : "swiperight" );
          }
          else if (
            Math.abs( startCoord.top - lastCoord.top ) > MIN_SWIPE_LENGTH &&
            Math.abs( startCoord.left - lastCoord.left ) < MAX_SWIPE_WIDTH
          ) {
           $(event.currentTarget)
            .trigger( "swipe" )
            .trigger( startCoord.top > lastCoord.top ? "swipeup" : "swipedown" );
          }
        }
      }
      
      function touchMove (event) {
        lastCoord.left = event.originalEvent.pageX;
        lastCoord.top = event.originalEvent.pageY;
      }
      
      $(document)
        .bind('touchmove', event.data, touchMove)
        .bind('touchend', event.data, touchEnd);
      
      event.preventDefault();
      
    }
    
    function gestureStart (event) {
      
      event.data = {
        lastCoord: {
          left: event.originalEvent.pageX,
          top: event.originalEvent.pageY
        },
        gestureTime: new Date().getTime()
      };
        
      var lastScale = 1.0,
          lastRotation = 0;
        
      function gestureEnd (event) {
        $(document)
          .unbind('gesturechange', gestureChange)
          .unbind('gestureend', gestureEnd);
      }
      
      function gestureChange (event) {
        var currentScale = event.originalEvent.scale,
            relativeScale = currentScale / lastScale,
            currentRotation = event.originalEvent.rotation % 360,
            relativeRotation = currentRotation - lastRotation,
            deltaLeft,
            deltaTop,
            lastCoordX,
            lastCoordY;
        
        if (relativeRotation > 90) {
          lastRotation = currentRotation;
          rotateUniverse();
        }
        else if (relativeRotation < -90) {
          lastRotation = currentRotation;
          rotateUniverseCounterClockwise();
        }
        else if (relativeScale < 0.75) {
          lastScale = currentScale;
          zoomOut();
        }
        else if (relativeScale > 1.5) {
          lastScale = currentScale;
          zoomIn();
        }
        else {
        
          viewportOffset.x = viewportOffset.x - (event.originalEvent.pageX - event.data.lastCoord.left);
          viewportOffset.y = viewportOffset.y - (event.originalEvent.pageY - event.data.lastCoord.top);

          event.data || (event.data = {});

          event.data.lastCoord || (event.data.lastCoord = {});

          event.data.lastCoord.left = event.originalEvent.pageX;
          event.data.lastCoord.top = event.originalEvent.pageY;
          console.log("<draw>")
          var d = (new Date()).getTime()
          draw();
          console.log("</draw>", (new Date()).getTime() - d)
        }
        
      }
      
      $(document)
        .bind('gesturechange', event.data, gestureChange)
        .bind('gestureend', event.data, gestureEnd);
        
    }
    
    ///////////////////////////////////////////////////////////////////

    canvasProxy
      .bind('mousedown', onDragStart)
      .bind("mousemove", trackLastMousePosition);

    $(document)
      .keypress(onKeypress)
      .keyup(onKeyup);
      
    $('#generations')
      .on('click', advance);

    $(window)
      .resize(draw)
      .trigger("resize");

    ///////////////////////////////////////////////////////////////////

    function onKeypress (event) {
      if (event.which === 43) {
        zoomIn();
      }
      else if (event.which === 45) {
        zoomOut();
      }
    }
    
    function trackLastMousePosition (event) {
      lastMousePosition = {
        x: event.pageX,
        y: event.pageY
      }
    }

    function onKeyup (event) {
      if (event.which === 32) {
        advance();
      }
      
      else if (event.which === 37) {
        panLeft();
      }
      else if (event.which === 38) {
        panUp();
      }
      else if (event.which === 39) {
        panRight();
      }
      else if (event.which === 40) {
        panDown();
      }
      
      else if (event.which === 18) {
        rotateUniverse();
      }
      
      else if (event.which === 49) {
        insert('Block');
      }
      else if (event.which === 50) {
        insert('Beehive');
      }
      else if (event.which === 51) {
        insert('Glider');
      }
      else if (event.which === 52) {
        insert('GosperGliderGun');
      }
    }

    function onDragStart (event) {
      event.data = {
        lastCoord:{
          left: event.clientX,
          top: event.clientY
        },
        mouseDownTime: new Date().getTime()
      };

      $(document)
        .bind("mouseup", event.data, onDragEnd)
        .bind("mousemove", event.data, onDragging);

     document.body.style.cursor = 'all-scroll';
    }

    var MAXCLICKDRAGDISTANCE = 1,
        MAXIMUMCLICKMILLISECONDS = 250;

    function onDragging (event) {
      var delta = {
          left: (event.clientX - event.data.lastCoord.left),
          top: (event.clientY - event.data.lastCoord.top)
      };

      viewportOffset.x = viewportOffset.x - delta.left;
      viewportOffset.y = viewportOffset.y - delta.top;

      event.data || (event.data = {});

      event.data.lastCoord || (event.data.lastCoord = {});

      event.data.lastCoord.left = event.clientX;
      event.data.lastCoord.top = event.clientY;

      if ((delta.left + delta.top) > MAXCLICKDRAGDISTANCE ) {
        event.data.mouseDownTime = null;
      }
      console.log(event);
      
      draw();
    }

    function onDragEnd (event) {
      $(document)
        .unbind("mousemove", onDragging)
        .unbind("mouseup", onDragEnd);

      var mouseUpTime = new Date().getTime(),
          mouseDownTime = event && event.data && event.data.mouseDownTime;

      if (mouseDownTime && (mouseUpTime - mouseDownTime) < MAXIMUMCLICKMILLISECONDS) {
        flipCell(event);
      }


      document.body.style.cursor = 'pointer';
    }
    
    // see http://www.mredkj.com/javascript/nfbasic.html
    function addCommas (nStr) {
    	nStr += '';
    	x = nStr.split('.');
    	x1 = x[0];
    	x2 = x.length > 1 ? '.' + x[1] : '';
    	var rgx = /(\d+)(\d{3})/;
    	while (rgx.test(x1)) {
    		x1 = x1.replace(rgx, '$1' + ',' + '$2');
    	}
    	return x1 + x2;
    }

  });

})(this);