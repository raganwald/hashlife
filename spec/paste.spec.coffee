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
  
  describe "uneven splits", ->
    
    checkerboard = QuadTree.fromString(
      '.*.*',
      '*.*.',
      '.*.*',
      '*.*.'
    )
    
    it "should handle an off-by-one 4x4", ->
      
      target = QuadTree.fromString(
        '....*.*.',
        '...*.*..',
        '....*.*.',
        '...*.*..',
        '........',
        '........',
        '........',
        '........'
      )
      
      expect( empty.paste(checkerboard, 1, -2).toJSON() ).toEqual target.toJSON()
      
  describe 'the blackness', ->
    
    describe '4x4', ->
  
      target = QuadTree.fromString(
        '****',
        '****',
        '****',
        '****'
      )
      
      it "should paste all blocks", ->
        for x in [-1..1]
          for y in [-1..1]
            expect( target.paste(block, x, y).toJSON() ).toEqual target.toJSON()
    
    describe '8x8', ->
  
      target = QuadTree.fromString(
        '********',
        '********',
        '********',
        '********',
        '********',
        '********',
        '********',
        '********'
      )
      
      it "should paste all blocks", ->
        for x in [-3..3]
          for y in [-3..3]
            expect( target.paste(block, x, y).toJSON() ).toEqual target.toJSON()
    
    describe '8x8', ->
  
      source = QuadTree.fromString(
        '........',
        '........',
        '..**....',
        '..**....',
        '........',
        '........',
        '........',
        '........'
      )
  
      one = QuadTree.fromString(
        '........',
        '........',
        '..**....',
        '..***...',
        '...**...',
        '........',
        '........',
        '........'
      )
      
      it "should paste at zero, zero", ->
        expect( source.paste(block, 0, 0).toJSON() ).toEqual one.toJSON()
        expect( source.double().paste(block, 0, 0).toJSON() ).toEqual one.double().toJSON()
        
  describe 'regression', ->
    
    it 'should paste a block on an empty square', ->
    
      for g in [3..7]
        for x in [-g..g]
          for y in [-g..g]
            result = new QuadTree().uncrop(g).paste(block,  x, y)
            expect( result.population ).toBe 4, "Failed to paste #{x}, #{y} in sqaure of generation #{g}"
    
    
    it 'should paste a block on a full square', ->
    
      for g in [3..7]
        for x in [-g..g]
          for y in [-g..g]
            result = Cell(1).stretchTo(g).paste(block,  x, y)
            expect( result.population ).toBe Math.pow(2, 2 * g), "Failed to paste #{x}, #{y} in full sqaure of generation #{g}"
                
     it "should paste a block on a block", ->
       
       source = QuadTree.fromString(
         '....****',
         '....****',
         '....****',
         '....****',
         '........',
         '........',
         '........',
         '........' 
       )
       
       expect( source.ne().population ).toBe 16, "bad ne()"
       
       expect( source.subTreeByIndices(-1, -1).toJSON() ).toEqual source.nw().toJSON()
       expect( source.subTreeByIndices(1, -1).toJSON() ).toEqual source.ne().toJSON()
       expect( source.subTreeByIndices(1, 1).toJSON() ).toEqual source.se().toJSON()
       expect( source.subTreeByIndices(-1, 1).toJSON() ).toEqual source.sw().toJSON()
       
       expect( source.paste(block, 3, -1).population ).toBe source.population
          