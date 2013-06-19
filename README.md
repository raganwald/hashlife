# La Hermosa Vida

"La Hermosa Vida" is--or will be--an implementation of [Conway's Game of Life][gol] in the browser. The purpose of this implementation is to serve as an excuse for talking about a few of the features being added to [Underscore][u] via [Underscore-Contrib][uc]. 

[gol]: https://en.wikipedia.org/wiki/Conway's_Game_of_Life
[u]: http://underscorejs.org
[uc]: https://github.com/documentcloud/underscore-contrib

### trying it

Clone this repo onto your computer, and then open `index.html` in a browser (It has only been tested with Safari on a Macintosh without Retina Display). You should see a window displaying a grid of small (8px by 8px) squares.

* You can flip the state of any square by double-clicking the square.
* You can zoom in by pressing `+` on your keyboard, or zoom out by pressing `-`.
* You can pan by clicking and dragging the grid.

That's all that is working right now.

### behind the scenes

The Life "universe" is represented as a [QuadTree][qt], with every node fully [canonicalized][canon]. Thus, the representation of a square of size `2^n` requires only `n` actual nodes, each of the same fixed size.

[qt]: https://en.wikipedia.org/wiki/Quadtree
[canon]: https://en.wikipedia.org/wiki/Canonicalization

The memory requirement for any given state of the universe depends deeply on the amount of entropy in the pattern as we see it as well as in its dynamic behaviour. Methuselah patterns can take up a lot of space while highly regular patterns like glider guns can take up very little space despite creating billions of live cells in their lifetime.

La Hermosa Vida begins with a very large square. If you pan near the edge, it doubles in size automatically. Thus, it gives the illusion of being an infinite plane. The cells are rendered on a canvas, and behind the scenes a "buffer canvas" allows for smooth scrolling within a neighbourhood.

### prior art

[A working engine based on QuadTrees, written in CoffeeScript][ru].

### work to be done

* A user experience for adding predefined patterns like Gliders and Puffer Trains
* Calculating the future of the universe
* A user experience for animating the universe

### schedule

La Hermosa Vida will be complete and displayed at [SpainJS] in Madrid, July 5-6 2013.

[SpainJS]: http://spainjs.org
[ru]: http://recursiveuniver.se