{Cell, QuadTree} = require '../assets/js/quad-tree'

require('../assets/js/future')

require('../assets/js/json')

_ = require('../assets/vendor/underscore')

describe "futures", ->

  describe "4x4", ->

    it "should return empty for an empty square", ->

      empty4 = Cell(0).stretchTo(2)
      empty2 = Cell(0).stretchTo(1)

      expect( empty4.future() ).toBe empty2

    it "should return empty for a full square", ->

      full4 = Cell(1).stretchTo(2)
      empty2 = Cell(0).stretchTo(1)

      expect( full4.future() ).toBe empty2

    it "should return full for a block", ->

      block2 = Cell(1).stretchTo(1)
      block4 = block2.double()

      expect( block4.future() ).toBe block2

    describe "das blinkenlights", ->

        it "should blink in position 0V", ->

          blink4 = QuadTree.fromString(
            '.*..',
            '.*..',
            '.*..',
            '....'
          );

          blink2 = QuadTree.fromString(
            '**',
            '..'
          )

          expect( blink4.future() ).toBe blink2

        it "should blink in position 0H", ->

          blink4 = QuadTree.fromString(
            '....',
            '***.',
            '....',
            '....'
          );

          blink2 = QuadTree.fromString(
            '*.',
            '*.'
          )

          expect( blink4.future() ).toBe blink2

        it "should blink in position 1V", ->

          blink4 = QuadTree.fromString(
            '..*.',
            '..*.',
            '..*.',
            '....'
          );

          blink2 = QuadTree.fromString(
            '**',
            '..'
          )

          expect( blink4.future() ).toBe blink2

        it "should blink in position 1H", ->

          blink4 = QuadTree.fromString(
            '....',
            '.***',
            '....',
            '....'
          );

          blink2 = QuadTree.fromString(
            '.*',
            '.*'
          )

          expect( blink4.future() ).toBe blink2

        it "should blink in position 2V", ->

          blink4 = QuadTree.fromString(
            '....',
            '..*.',
            '..*.',
            '..*.'
          );

          blink2 = QuadTree.fromString(
            '..',
            '**'
          )

          expect( blink4.future() ).toBe blink2

        it "should blink in position 2H", ->

          blink4 = QuadTree.fromString(
            '....',
            '....',
            '.***',
            '....'
          );

          blink2 = QuadTree.fromString(
            '.*',
            '.*'
          )

          expect( blink4.future() ).toBe blink2

        it "should blink in position 3V", ->

          blink4 = QuadTree.fromString(
            '....',
            '.*..',
            '.*..',
            '.*..'
          );

          blink2 = QuadTree.fromString(
            '..',
            '**'
          )

          expect( blink4.future() ).toBe blink2

        it "should blink in position 3H", ->

          blink4 = QuadTree.fromString(
            '....',
            '....',
            '***.',
            '....'
          );

          blink2 = QuadTree.fromString(
            '*.',
            '*.'
          )

          expect( blink4.future() ).toBe blink2

  describe "8x8", ->
    
    describe "intermediate expectations", ->
      
      it "should do the right thing with intermediate nw", ->
        
        fourByFour = QuadTree.fromString(
          '....',
          '....',
          '..**',
          '..**'
        );
        
        twoByTwo = QuadTree.fromString(
          '..',
          '.*'
        );
        
        expect( fourByFour.future() ).toBe twoByTwo
      
      it "should do the right thing with intermediate nn", ->
        
        fourByFour = QuadTree.fromString(
          '....',
          '....',
          '**..',
          '**..'
        );
        
        twoByTwo = QuadTree.fromString(
          '..',
          '*.'
        );
        
        expect( fourByFour.future() ).toBe twoByTwo
        
    it "should get the correct ne() and nn() in the first place", ->
      
      eightByEight = QuadTree.fromString(
        '........',
        '........',
        '..**....',
        '..**....',
        '........',
        '........',
        '........',
        '........'
      )
      
      nw = QuadTree.fromString(
        '....',
        '....',
        '..**',
        '..**'
      );
      
      nn = QuadTree.fromString(
        '....',
        '....',
        '**..',
        '**..'
      );
      
      expect( eightByEight.nw().toJSON() ).toEqual nw.toJSON(), "nw() is broken"
      
      expect( eightByEight.nn().toJSON() ).toEqual nn.toJSON(), "nn() is broken"

    it "should return empty for an empty square", ->
    
      empty8 = Cell(0).stretchTo(3)
      empty4 = Cell(0).stretchTo(2)
    
      expect( empty8.future() ).toBe empty4
    
    it "should return empty for a full square", ->
    
      full8 = Cell(1).stretchTo(3)
      empty4 = Cell(0).stretchTo(2)
    
      expect( full8.future() ).toBe empty4
    
    it "should return full for various blocks", ->
    
      block = QuadTree.fromString(
        '**',
        '**'
      )
      
      empty = QuadTree.fromString(
        '..',
        '..'
      )
      
      destinations = _.map [0..3], (n) ->
        children = [empty, empty, empty, empty]
        children[n] = block
        new QuadTree(children)
      
      _.each destinations, (fourByFour) ->
        eightByEight = fourByFour.double()
        expect( eightByEight.future().toJSON() ).toEqual fourByFour.toJSON()