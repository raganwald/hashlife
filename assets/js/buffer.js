(function (root, undefined) {
  
  var A = (root.allong && root.allong.es) || require('../vendor/allong.es.browser');

  var QuadTree = root.QuadTree || require('./quad-tree').QuadTree,
      Cell     = root.Cell     || require('./quad-tree').Cell
      
  if (A.isUndefined(Cell.prototype.generation)) {
    require('./children');
  }
  
  A.extendClass(QuadTree, {

    // cellSize: 8
    // viewPort:
    //   height: 10
    //   width: 10
    //   offset:
    //     x: 0
    //     y: 0
    getBuffer: function (params) {
      var cellSize = params.cellSize,
          viewPort = params.viewPort;
          
      var thisWidth = this.width * cellSize,
          childWidth = thisWidth / 2,
          grandchildWidth = childWidth / 2;
      
      var viewportUpperLeft = {
        x: viewPort.offset.x - (viewPort.width / 2),
        y: viewPort.offset.y - (viewPort.height / 2)
      };
      
      var viewportLowerRight = {
        x: viewPort.offset.x + (viewPort.width / 2),
        y: viewPort.offset.y + (viewPort.height / 2)
      };
      
      var maxExtant = Math.max(
        Math.abs(viewportUpperLeft.x),
        Math.abs(viewportUpperLeft.y),
        Math.abs(viewportLowerRight.x),
        Math.abs(viewportLowerRight.x)
      );
      
      if (maxExtant > childWidth) return null;
      
      if (viewPort.width > childWidth || viewPort.height > childWidth) {
        return {
          buffer: this,
          offset: {
            x: viewportUpperLeft.x + childWidth, // really - (-childWidth)
            y: viewportUpperLeft.y + childWidth
          }
        };
      }
      
      var childArr = [
        {
          childUpperLeft: {
            x: -childWidth,
            y: -childWidth
          },
          childLowerRight: {
            x: 0,
            y: 0
          },
          accessor: "nw"
        },
        {
          childUpperLeft: {
            x: 0,
            y: -childWidth
          }, 
          childLowerRight: {
            x: childWidth,
            y: 0
          },
          accessor: "ne"
        },
        {
          childUpperLeft: {
            x: 0,
            y: 0
          },
          childLowerRight: {
            x: childWidth,
            y: childWidth
          },
          accessor: "se"
        },
        {
          childUpperLeft: {
            x: -childWidth,
            y: 0
          },
          childLowerRight: {
            x: 0,
            y: childWidth
          },
          accessor: "sw"
        },
        {
          childUpperLeft: {
            x: -childWidth / 2,
            y: -childWidth
          },
          childLowerRight: {
            x: childWidth / 2,
            y: 0
          },
          accessor: "nn"
        },
        {
          childUpperLeft: {
            x: 0,
            y: -childWidth / 2
          },
          childLowerRight: {
            x: childWidth,
            y: childWidth / 2
          },
          accessor: "ee"
        },
        {
          childUpperLeft: {
            x: -childWidth / 2,
            y: 0
          },
          childLowerRight: {
            x: childWidth / 2,
            y: childWidth
          },
          accessor: "ss"
        },
        {
          childUpperLeft: {
            x: -childWidth,
            y: -childWidth / 2
          },
          childLowerRight: {
            x: 0,
            y: childWidth / 2
          },
          accessor: "ww"
        },
        {
          childUpperLeft: {
            x: -childWidth / 2,
            y: -childWidth / 2
          },
          childLowerRight: {
            x: childWidth / 2,
            y: childWidth / 2
          },
          accessor: "cc"
        }
      ];
        
      var found = A.first(childArr, function (info) {
        return (viewportUpperLeft.x >= info.childUpperLeft.x &&
                viewportUpperLeft.y >= info.childUpperLeft.y &&
                viewportLowerRight.x <= info.childLowerRight.x &&
                viewportLowerRight.y <= info.childLowerRight.y);
      });
      
      if (found == null) {
        return {
          buffer: this,
          offset: {
            x: viewportUpperLeft.x + childWidth, // really - (-childWidth)
            y: viewportUpperLeft.y + childWidth
          }
        }
      }
      else if (viewPort.width > grandchildWidth || viewPort.height > grandchildWidth) {
        return {
          buffer: this[found.accessor](),
          offset: {
            x: viewportUpperLeft.x - found.childUpperLeft.x,
            y: viewportUpperLeft.y - found.childUpperLeft.y
          }
        };
      }
      else {
        var child = this[found.accessor](),
            childUpperLeft = found.childUpperLeft,
            childLowerRight = found.childLowerRight,
            childOffset = {
              x: childUpperLeft.x + ((childLowerRight.x - childUpperLeft.x) / 2),
              y: childUpperLeft.y + ((childLowerRight.y - childUpperLeft.y) / 2)
            }
            childParams = {
              cellSize: cellSize,
              viewPort: {
                height: viewPort.height,
                width: viewPort.width,
                offset: {
                  x: viewPort.offset.x - childOffset.x,
                  y: viewPort.offset.y - childOffset.y
                }
              }
            };
            
        return child.getBuffer(childParams);
            
      }
    },
    
    drawInto: function (drawParams) {
      var cellSize = drawParams.cellSize,
          viewportCanvas = drawParams.canvas,
          viewportContext = drawParams.context,
          offset = drawParams.offset,
          bufferParams = {
            cellSize: cellSize,
            viewPort: {
              height: viewportCanvas.height,
              width: viewportCanvas.width,
              offset: offset
            }
          },
          bufferInfo = this.getBuffer(bufferParams) || (function () { throw "Viewport does not fit into receiver"; })(),
          bufferCanvas = bufferInfo.buffer.canvas(cellSize),
          relativeScroll = bufferInfo.offset;
          
      viewportContext.drawImage(bufferCanvas, relativeScroll.x, relativeScroll.y, viewportCanvas.width, viewportCanvas.height, 0, 0, viewportCanvas.width, viewportCanvas.height);
      
      return bufferInfo;
      
    },
    
    doesNotEnclose: function (params) {
      var cellSize = params.cellSize,
          viewPort = params.viewPort,
          childWidth = this.width * cellSize / 2,
          viewportUpperLeft = {
            x: viewPort.offset.x - (viewPort.width / 2),
            y: viewPort.offset.y - (viewPort.height / 2)
          },
          viewportLowerRight = {
            x: viewPort.offset.x + (viewPort.width / 2),
            y: viewPort.offset.y + (viewPort.height / 2)
          },
          maxExtant = Math.max(
            Math.abs(viewportUpperLeft.x),
            Math.abs(viewportUpperLeft.y),
            Math.abs(viewportLowerRight.x),
            Math.abs(viewportLowerRight.x)
          );
      
      return (maxExtant > childWidth);
    }
    
  })

})(this);