{Cell, QuadTree} = require '../assets/js/quad-tree'

require('../assets/js/json')
require('../assets/js/buffer')

_ = require('../assets/vendor/underscore')

describe "buffer and viewporting", ->

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
  # 2. wholly encloses the input rectange.
  #
  # And:
  #
  # The offset ul->ul of viewport within buffer. The client is repsonsible for
  # knowing where the center of the viewport is, and the center of the buffer is 
  # irrelevant at this point.
  
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
    
    expect( _.isFunction(universe.getBuffer) ).toBe true
    
    expect( universe.getBuffer
      cellSize: 8
      viewPort:
        height: 10
        width: 10
        offset:
          x: 0
          y: 0
    ).not.toBeUndefined()
    
  it "should be null when the viewport is larger than the QuadTree", ->
    
    expect( universe.getBuffer
      cellSize: 8
      viewPort:
        height: 129
        width: 129
        offset:
          x: 0
          y: 0
    ).toBeNull()
    
  it "should not be null when the viewport is smaller than the QuadTree", ->
    
    expect( universe.getBuffer
      cellSize: 8
      viewPort:
        height: 100
        width: 100
        offset:
          x: 0
          y: 0
    ).not.toBeNull()
    
  it "should be null when the viewport is smaller than the QuadTree but offset too far", ->
    
    expect( universe.getBuffer
      cellSize: 8
      viewPort:
        height: 100
        width: 100
        offset:
          x: 50
          y: 0
    ).toBeNull()
    
    expect( universe.getBuffer
      cellSize: 8
      viewPort:
        height: 100
        width: 100
        offset:
          x: 5
          y: -40
    ).toBeNull()
    
  it 'should be the receiver when the viewport is smaller than the receiver but > 1/2 the receiver', ->
    
    result = universe.getBuffer
      cellSize: 8
      viewPort:
        height: 100
        width: 100
        offset:
          x: 0
          y: 0
    
    expect( result.buffer ).toBe universe
    
  describe "children", ->
    
    it "should be the nw when it fits the nw perfectly", ->
    
      result = universe.getBuffer
        cellSize: 8
        viewPort:
          height: 64
          width: 64
          offset:
            x: -32
            y: -32
          
      expect(result.buffer.toJSON()).toEqual universe.nw().toJSON()
    
      expect(result.offset).toEqual
        x: 0
        y: 0
    
    it "should be the ne when it fits the ne perfectly", ->
    
      result = universe.getBuffer
        cellSize: 8
        viewPort:
          height: 64
          width: 64
          offset:
            x:  32
            y: -32
          
      expect(result.buffer.toJSON()).toEqual universe.ne().toJSON()
    
      expect(result.offset).toEqual
        x: 0
        y: 0
    
    it "should be the se when it fits inside without further offset", ->
    
      result = universe.getBuffer
        cellSize: 8
        viewPort:
          height: 60
          width: 60
          offset:
            x:  32
            y:  32
          
      expect(result.buffer.toJSON()).toEqual universe.se().toJSON()
    
      expect(result.offset).toEqual
        x:  2
        y:  2
    
    it "should be the sw when it fits inside with an offset", ->
    
      result = universe.getBuffer
        cellSize: 8
        viewPort:
          height: 40
          width: 40
          offset:
            x:  -20
            y:  20
          
      expect(result.buffer.toJSON()).toEqual universe.sw().toJSON()
    
      expect(result.offset).toEqual
        x:  24
        y:  0
      
  describe "grandchildren", ->
    
    it "should be the nw nw", ->
    
      result = universe.getBuffer
        cellSize: 8
        viewPort:
          height: 32
          width: 32
          offset:
            x: -48
            y: -48
          
      expect(result.buffer.toJSON()).toEqual universe.nw().nw().toJSON()
    
      expect(result.offset).toEqual
        x: 0
        y: 0
      
      