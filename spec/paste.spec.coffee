{Cell, QuadTree} = require '../assets/js/quad-tree'

require('../assets/js/json')
require('../assets/js/paste')

_ = require('../assets/vendor/underscore')

describe "pasting", ->

  empty = Cell(0).stretchTo(3)

  it "should have a paste method", ->

    expect( _.isFunction(empty.paste) ).toBe true, "implement 'paste', please"

  it "should have a fromString function", ->

    expect( _.isFunction(QuadTree.fromString) ).toBe true, "implement 'QuadTree.fromString', please"

  describe "a 4x4 block", ->

    block = Cell(1).stretchTo(1)
    target = QuadTree.fromString(
      '**......',
      '**......',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........'
    )

    it "should make sane blocks", ->
      expect(block).not.toBeUndefined()
      expect(empty).not.toBeUndefined()
      expect(target).not.toBeUndefined()

      expect( block instanceof QuadTree ).toBe true
      expect( empty instanceof QuadTree ).toBe true
      expect(target instanceof QuadTree ).toBe true

      expect( _.isFunction(empty.paste) ).toBe true

    it "should handle block over block", ->

      expect( empty.paste(block, -3, -3).toJSON() ).toEqual target.toJSON()