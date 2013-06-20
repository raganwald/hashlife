{Cell, QuadTree} = require '../assets/js/quad-tree'

require('../assets/js/future')

require('../assets/js/json')

describe "futures", ->

  describe "4x4", ->

    # it "should return empty for an empty square", ->
    #
    #   empty4 = Cell(0).resizeTo(2)
    #   empty2 = Cell(0).resizeTo(1)
    #
    #   expect( empty4.future() ).toBe empty2
    #
    # it "should return empty for a full square", ->
    #
    #   full4 = Cell(1).resizeTo(2)
    #   empty2 = Cell(0).resizeTo(1)
    #
    #   expect( full4.future() ).toBe empty2
    #
    # it "should return full for a block", ->
    #
    #   block2 = Cell(1).resizeTo(1)
    #   block4 = block2.double()
    #
    #   expect( block4.future() ).toBe block2

    it "should partially blink", ->

      blink4 = new QuadTree [
        new QuadTree([Cell(0), Cell(1), Cell(1), Cell(0)]),
        new QuadTree([Cell(0), Cell(0), Cell(0), Cell(0)]),
        new QuadTree([Cell(0), Cell(0), Cell(0), Cell(0)]),
        new QuadTree([Cell(0), Cell(1), Cell(0), Cell(0)])
      ]
      blink2 = new QuadTree([Cell(1), Cell(1), Cell(0), Cell(0)])

      expect( blink4.future() ).toBe blink2