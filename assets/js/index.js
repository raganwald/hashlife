(function (root) {

  var LOG2 = Math.log(2);

  $(document).ready(function () {

    // viewport
    var viewportCanvas = $('canvas#viewport'),
        viewportContext = viewportCanvas[0].getContext("2d"),
        viewportOffset = { x: 0, y: 0 };

    viewportCanvas.height = window.innerHeight;
    viewportCanvas.width = window.innerWidth;

    // the buffer within the universe
    var length = Math.ceil(Math.max(window.innerHeight, window.innerWidth) / Cell.size()),
        log2 = Math.log(length)/LOG2,
        bufferGeneration = Math.ceil(log2),
        bufferTree = Cell(0).stretchTo(bufferGeneration),
        bufferCanvas = bufferTree.canvas();

    // the universe
    root.universe = bufferTree.double().double();
    root.generation = 0;
    
    ///////////////////////////////////////////////////////////////////

    viewportCanvas
      .bind('mousedown', onDragStart);

    $(document)
      .dblclick(gliderGun)
      .keypress(onKeypress)
      .keyup(onKeyup);

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

    function onKeyup (event) {
      if (event.which === 37) {
        panLeft();
      }
      if (event.which === 38) {
        panUp();
      }
      if (event.which === 39) {
        panRight();
      }
      if (event.which === 40) {
        panDown();
      }
      if (event.which === 32) {
        advance();
      }
    }
    
    function panLeft () {
      viewportOffset.x -= viewportCanvas.width;
      draw()
    }
    
    function panRight () {
      viewportOffset.x += viewportCanvas.width;
      draw()
    }
    
    function panUp () {
      viewportOffset.y -= viewportCanvas.height;
      draw()
    }
    
    function panDown () {
      viewportOffset.y += viewportCanvas.height;
      draw()
    }

    function advance () {
      var thisGenerationRulesTheNation = root.universe.generation;

      root.generation = root.generation + (root.universe.size() / 2)
      root.universe = root.universe
        .double()
        .double()
        .future()
        .trimmed()
        .uncrop(thisGenerationRulesTheNation);
      
      draw();
    }

    function zoomIn () {
      Cell.size(Cell.size() * 2);
      draw();
    }

    function zoomOut () {
      if (root.Cell.size() >= 2) {
        Cell.size(Cell.size() / 2);
        draw();
      }
    }

    function noZero (n) {
      return Math.floor(n >= 0
                        ? n + 1
                        : n
             );
    }

    function gliderGun (event) {

      var relativeToUniverseCenterInCells = {
        x: noZero((viewportOffset.x - (viewportCanvas.width / 2) + event.clientX) / Cell.size()),
        y: noZero((viewportOffset.y - (viewportCanvas.height / 2) + event.clientY) / Cell.size())
      };

      root.universe = root.universe.paste(QuadTree.Library.GosperGliderGunSE, relativeToUniverseCenterInCells.x, relativeToUniverseCenterInCells.y)

      draw();
    }

    function flipCell (event) {

      var relativeToUniverseCenterInCells = {
        x: noZero((viewportOffset.x - (viewportCanvas.width / 2) + event.clientX) / Cell.size()),
        y: noZero((viewportOffset.y - (viewportCanvas.height / 2) + event.clientY) / Cell.size())
      };

      root.universe = root.universe.flip(relativeToUniverseCenterInCells);

      draw();
    }

    function onDragStart (event) {
      event.data = {
        lastCoord:{
          left : event.clientX,
          top : event.clientY
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
          left : (event.clientX - event.data.lastCoord.left),
          top : (event.clientY - event.data.lastCoord.top)
      };

      viewportOffset.x = viewportOffset.x - delta.left;
      viewportOffset.y = viewportOffset.y - delta.top;

      event.data || (event.data = {});

      event.data.lastCoord || (event.data.lastCoord = {});

      _.extend(event.data.lastCoord, {
        left : event.clientX,
        top : event.clientY
      });

      if ((delta.left + delta.top) > MAXCLICKDRAGDISTANCE ) {
        event.data.mouseDownTime = null;
      }
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

    function draw () {

      //synchronize window and canvas dimensions
      viewportCanvas[0].width = $(window).width();
      viewportCanvas[0].height = $(window).height();
      
      while (root.universe.doesNotEnclose({
        cellSize: Cell.size(),
        viewPort: {
          height: viewportCanvas[0].height,
          width: viewportCanvas[0].width,
          offset: viewportOffset
        }
      })) root.universe = root.universe.double();

      root.universe.drawInto({
        cellSize: Cell.size(),
        canvas: viewportCanvas[0],
        context: viewportContext,
        offset: viewportOffset
      });
      
      $('#generation').text(addCommas(root.generation));
      $('#population').text(addCommas(root.universe.population));
      $('#width').text(addCommas(root.universe.width));
      
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