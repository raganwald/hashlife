{Cell, QuadTree} = require '../assets/js/quad-tree'

require('../assets/js/future')

require('../assets/js/json')

describe "futures", ->

  describe "4x4", ->

    it "should return empty for an empty square", ->

      empty4 = Cell(0).resizeTo(2)
      empty2 = Cell(0).resizeTo(1)

      expect( empty4.future() ).toBe empty2

    it "should return empty for a full square", ->

      full4 = Cell(1).resizeTo(2)
      empty2 = Cell(0).resizeTo(1)

      expect( full4.future() ).toBe empty2

    it "should return full for a block", ->

      block2 = Cell(1).resizeTo(1)
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