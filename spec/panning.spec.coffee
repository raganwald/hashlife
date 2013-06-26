{Cell, QuadTree} = require '../assets/js/quad-tree'

require('../assets/js/json')
require('../assets/js/children')

_ = require('../assets/vendor/underscore')

describe "panning", ->

  # Input:
  #
  # QuadTree
  # Cell size
  # Rectangle height, width, and offset from centre of quadtree in pixels
  #
  # Output:
  #
  # A QuadTree...
  #
  # 1. wholly contained within the input QuadTree.
  # 2. offset c-c in px from the input QT.
  # 3. offset c-c in px from the input rectangle.
  # 4. wholly encloses the input rectange.
  
  universe = QuadTree.fromString(
    '................',
    '...............*',
    '..............*.',
    '..............**',
    '.............*..',
    '.............*.*',
    '.............**.',
    '.............***',
    '............*...',
    '............*..*',
    '............*.*.',
    '............*.**',
    '............**..',
    '............**.*',
    '............***.',
    '............****',
  )
  
  it "should have a method that takes the correct parameters", ->
    
    expect( _.isFunction(universe.buffer) ).toBe true
    
    expect( universe.buffer
      cellSize: 8
      viewPort:
        height: 10
        width: 10
        offset:
          x: 0
          y: 0
    ).not.toBeUndefined()
    