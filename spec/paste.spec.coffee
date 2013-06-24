{Cell, QuadTree} = require '../assets/js/quad-tree'

require('../assets/js/json')
require('../assets/js/paste')

_ = require('../assets/vendor/underscore')

describe "pasting", ->

  empty = Cell(0).stretchTo(3)

  block = Cell(1).stretchTo(1)

  it "should have a paste method", ->

    expect( _.isFunction(empty.paste) ).toBe true, "implement 'paste', please"

  it "should have a fromString function", ->

    expect( _.isFunction(QuadTree.fromString) ).toBe true, "implement 'QuadTree.fromString', please"

  describe "whole subtrees", ->
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

    it "should handle block over block 1", ->

      expect( empty.paste(block, -3, -3).toJSON() ).toEqual target.toJSON()

    it "should handle block over block 2", ->
      target2 = QuadTree.fromString(
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '**......',
        '**......'
      )

      expect( empty.paste(block, -3, 3).toJSON() ).toEqual target2.toJSON()

    it "should handle block over block 3", ->
      target2 = QuadTree.fromString(
        '........',
        '........',
        '..**....',
        '..**....',
        '........',
        '........',
        '........',
        '........'
      )

      expect( empty.paste(block, -1, -1).toJSON() ).toEqual target2.toJSON()
  
  describe "split subtrees", ->
    
    it "should handle nn", ->
      
      target = QuadTree.fromString(
        '...**...',
        '...**...',
        '........',
        '........',
        '........',
        '........',
        '........',
        '........'
      )
      
      expect( empty.paste(block, 0, -3).toJSON() ).toEqual target.toJSON()
    
    it "should handle ss", ->
      
      target = QuadTree.fromString(
        '........',
        '........',
        '........',
        '........',
        '........',
        '........',
        '...**...',
        '...**...'
      )
      
      expect( empty.paste(block, 0, 3).toJSON() ).toEqual target.toJSON()
    
    it "should handle ee", ->
      
      target = QuadTree.fromString(
        '........',
        '........',
        '........',
        '**......',
        '**......',
        '........',
        '........',
        '........'
      )
      
      expect( empty.paste(block, -3, 0).toJSON() ).toEqual target.toJSON()
    
    it "should handle ww", ->
      
      target = QuadTree.fromString(
        '........',
        '........',
        '........',
        '......**',
        '......**',
        '........',
        '........',
        '........'
      )
      
      expect( empty.paste(block, 3, 0).toJSON() ).toEqual target.toJSON()
    
    it "should handle ss-nn", ->
      
      target = QuadTree.fromString(
        '........',
        '........',
        '........',
        '........',
        '...**...',
        '...**...',
        '........',
        '........'
      )
      
      expect( empty.paste(block, 0, 1).toJSON() ).toEqual target.toJSON()
      
  describe "double block", ->
    
    checkerboard = QuadTree.fromString(
      '.*.*',
      '*.*.',
      '.*.*',
      '*.*.'
    )
    
    it "should handle nw", ->

      target = QuadTree.fromString(
        '.*.*....',
        '*.*.....',
        '.*.*....',
        '*.*.....',
        '........',
        '........',
        '........',
        '........'
      )
      
      expect( empty.paste(checkerboard, -2, -2).toJSON() ).toEqual target.toJSON()
    
    it "should handle ww", ->

      target = QuadTree.fromString(
        '........',
        '........',
        '.*.*....',
        '*.*.....',
        '.*.*....',
        '*.*.....',
        '........',
        '........'
      )
      
      expect( empty.paste(checkerboard, -2, 0).toJSON() ).toEqual target.toJSON()
      