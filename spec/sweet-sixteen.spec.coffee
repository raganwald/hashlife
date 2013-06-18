{Cell, QuadTree} = require '../assets/js/quad-tree'

require('../assets/js/future')

require('../assets/js/json')

_ = require('underscore')

describe "json", ->
  
  describe "for Cell", ->
  
    it "should return primitives", ->
    
      expect( Cell(0).toJSON() ).toBe 0
    
      expect( Cell(1).toJSON() ).toBe 1
      
      
  describe "for QuadTree", ->
    
    it "should work for 2x2", ->
      
      empty = new QuadTree([Cell(0), Cell(0), Cell(0), Cell(0)])
      
      expect( empty.toJSON() ).toEqual [[0, 0], [0, 0]]

describe "all", ->
  
  it "should provide two different cells", ->
    
    expect( QuadTree.all(0).length ).toBe 2
    
  it "should return cells", ->
    
    _.each QuadTree.all(0), (qt) ->
      expect( qt instanceof Cell ).toBe true
    
  it "should provide sixteen different 2x2 trees", ->
    
    expect( QuadTree.all(1).length ).toBe 16
    
  it "should return trees", ->
    
    _.each QuadTree.all(1), (qt, index) ->
      expect( qt instanceof QuadTree ).toBe true, index
    
  it "should provide 65536 different 4x4 trees", ->
    
    expect( QuadTree.all(2).length ).toBe 65536

describe "population", ->
  
  it "should work for cells", ->
    
    expect( Cell(0).population ).toBe 0
    
    expect( Cell(1).population ).toBe 1
    
  