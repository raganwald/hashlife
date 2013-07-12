# La Hermosa Vida

"La Hermosa Vida" is an implementation of [Conway's Game of Life][gol] in the browser, using Bill Gosper's [HashLife] algorithm. It was written to accompany my [talk][lhs] at SpainJS, 2013.

You can try it online [here][try].

[gol]: https://en.wikipedia.org/wiki/Conway's_Game_of_Life
[HashLife]: https://en.wikipedia.org/wiki/Hashlife
[lhs]: http://www.haikudeck.com/p/x2kAbNDLL9/la-hermosa-vida

### infinity

The basic idea is to present the illusion of an infinite Life universe. You can pan indefinitely. You can generate patterns with trillions of live cells. You can quadrillions of generations into the future. But there is no concept of a fixed limit in space or time. The universe is a plane stretching to infinity in every direction.

For example, you can pan in any direction as far as you like and then place some live cells, perhaps a glider or shuttle. There is no edge in any direction. The plane does not wrap back on itself. Patterns that grow in space, like two gliders travelling in opposite directions, can grow indefinitely. Patterns that grow in population, like a glider gun, can also grow indefinitely.

### desktop instructions

* You can flip the state of any square by clicking the square.
* You can zoom in by pressing `+` on your keyboard, or zoom out by pressing `-`.
* You can pan by dragging the grid.
* You can also press an arrow key to move a screenful up, down, left, or right.
* You can rotate the screen by pressing option.
* You can insert some shapes by pressing `1`, `2`, `3`, or `4`.
* You can press the space bar step one generation into the future.
* You can press enter to jump into the future.

### iOS instructions

* You can flip the state of a square with a single tap.
* You can zoom in or out using the pinch gesture.
* You can drag the universe within the window using two fingers.
* You can jump into the future by swiping to the left or right (it doesn't matter which way you swipe).
* You can insert a [glider gun][ggg] by tapping and holding. 

[ggg]: http://www.conwaylife.com/wiki/index.php?title=Gosper_glider_gun
[try]: http://raganwald.com/LaHermosaVida

On a first-generation iPad Mini, the current implementation is somewhat unreliable. I suspect that Mobile Safari's JavaScript engine is not as robust as OS X Safari when managing large object graphs.

### jumping into the future

When you jump into the future, the number of generations jumped depends upon the size of the pattern in the display. If you have a pattern that grows in space (like the glider gun), it will jump forward in ever-increasing numbers of generations. It takes 30 or so ever-accelerating jumps to take a glider gun up to a trillion generations and a population of 366 billion cells.

### representing the universe

The Life "universe" is represented as a [QuadTree][qt], with every node fully [canonicalized][canon]. Thus, the representation of a square of size `2^n` requires only `n` actual nodes, each of the same fixed size.

[qt]: https://en.wikipedia.org/wiki/QuadTree
[canon]: https://en.wikipedia.org/wiki/Canonicalization

The memory requirement for any given state of the universe depends deeply on the amount of entropy in the pattern as we see it as well as in its dynamic behaviour. Methuselah patterns can take up a lot of space while highly regular patterns like glider guns can take up very little space despite creating billions of live cells in their lifetime.

The current implementation does not perform any cache eviction, so complex patterns can "crash" the engine, while simple figures like the glider gun can grow to trillions of cells.

### the user experience

The visible portion of the universe (the "viewport") is rendered in a canvas. To draw this portion, an algorithm locates the smallest possible QuadTree in the universe that encloses the viewport, gets a canvas representing the QuadTree at the current level of zoom, and then copies the appropriate selection of the QuadTree canvas into the viewport canvas.

Each QuadTree generates canvases on demand by recursively asking their children for canvases and then assembling a new canvas out of the four sub-canvases. Canvases are cached with the canonical QuadTrees, so actions like rapidly panning over empty spaces do not require drawing new canvases, just repeatedly locating a QuadTree and copying the appropriate portion.

### prior art

[A command-line HashTree implementation written in Literate CoffeeScript][ru].

[SpainJS]: http://spainjs.org
[ru]: http://recursiveuniver.se

### license

The MIT License (MIT)
Copyright © 2013 Reginald Braithwaite

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.