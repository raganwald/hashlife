{Cell, QuadTree} = require '../assets/js/quad-tree'

require('../assets/js/future')

require('../assets/js/json')

_ = require('underscore')

describe "futures", ->
  
  describe "4x4", ->
    
    it "should return empty for an empty square", ->
    
      empty4 = Cell(0).resizeTo(2)
      empty2 = Cell(0).resizeTo(1)
    
      expect( empty4.future() ).toBe empty2