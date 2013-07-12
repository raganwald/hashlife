(function (root) {
  
  function after (decoration) {
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

    var LOG2 = Math.log(2);

    // the universe
    var universe = new QuadTree();
    var currentGeneration = 0;

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
      $('#fastforward').text(addCommas(Math.ceil(Math.pow(2, universe.trimmed().generation - 2))));
      $('#population').text(addCommas(universe.population));
      $('#nodes').text(addCommas(QuadTree.nodes()));
      
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

    var step = triggersRedraw( function () {
      var thisGenerationRulesTheNation = universe.generation;
      universe = universe
                        .trimmed()
                        .double()
                        .double();
                        
      currentGeneration = currentGeneration + 1;
      
      universe = universe
                        .futureAt(1)
                        .trimmed();
    });

    var fastForward = triggersRedraw( function () {
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
        .bind("touchmove", function (e) { event.preventDefault(); })
        .bind('gesturestart', gestureStart);
        // .bind("touchstart", touchStart)
        
      canvasProxy
        .bind("swipe", fastForward)
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
      
      var lastCoord = {
            left: event.originalEvent.pageX,
            top: event.originalEvent.pageY
          },
          lastScale = 1.0,
          lastRotation = 0;
        
      function gestureEnd (event) {
        $(document)
          .unbind('gesturechange', gestureChange)
          .unbind('gestureend', gestureEnd);
      }
      
      var updateDrag = triggersRedraw( function (x, y) {
        viewportOffset.x = viewportOffset.x - (x - lastCoord.left);
        viewportOffset.y = viewportOffset.y - (y - lastCoord.top);

        lastCoord.left = x;
        lastCoord.top = y;
      });
      
      function gestureChange (event) {
        var currentScale = event.originalEvent.scale,
            relativeScale = currentScale / lastScale,
            currentRotation = event.originalEvent.rotation % 360,
            relativeRotation = currentRotation - lastRotation;
        
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
        else updateDrag(event.originalEvent.pageX, event.originalEvent.pageY);
      }
      
      $(document)
        .bind('gesturechange', event.data, gestureChange)
        .bind('gestureend', event.data, gestureEnd);
        
    }
    
    ///////////////////////////////////////////////////////////////////

    canvasProxy
      .on('mousedown', onDragStart)
      .on("mousemove", trackLastMousePosition);

    $(document)
      .keypress(onKeypress)
      .keyup(onKeyup);
      
    $('#doFastForward')
      .on('click', fastForward);
      
    $('#help, #discuss')
      .on('click', link);


    $(window)
      .resize(draw)
      .trigger("resize");

    ///////////////////////////////////////////////////////////////////
    
    function link (event) {
      window.location = $(event.currentTarget).attr('href');
    }

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
      if (event.which === 13) {
        fastForward();
      }
      else if (event.which === 32) {
        step();
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

      var MAXCLICKDRAGDISTANCE = 1,
          MAXIMUMCLICKMILLISECONDS = 250;
        
      var lastCoord = {
            left: event.clientX,
            top: event.clientY
          },
          mouseDownTime = new Date().getTime();

      $(document)
        .bind("mouseup", event.data, onDragEnd)
        .bind("mousemove", event.data, onDragging);

      document.body.style.cursor = 'all-scroll';

      function onDragging (event) {
        var delta = {
            left: (event.clientX - lastCoord.left),
            top: (event.clientY - lastCoord.top)
        };

        viewportOffset.x = viewportOffset.x - delta.left;
        viewportOffset.y = viewportOffset.y - delta.top;

        lastCoord.left = event.clientX;
        lastCoord.top = event.clientY;

        if ((delta.left + delta.top) > MAXCLICKDRAGDISTANCE ) {
          mouseDownTime = null;
        }
      
        draw();
      }

      function onDragEnd (event) {
        $(document)
          .unbind("mousemove", onDragging)
          .unbind("mouseup", onDragEnd);

        var mouseUpTime = new Date().getTime();

        if (mouseDownTime && (mouseUpTime - mouseDownTime) < MAXIMUMCLICKMILLISECONDS) {
          flipCell(event);
        }


        document.body.style.cursor = 'pointer';
      }
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