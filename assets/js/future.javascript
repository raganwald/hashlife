(function (root) {
  
  var A = (root.allong && root.allong.es) || require('../vendor/allong.es.browser').allong.es;

  var QuadTree = root.QuadTree || require('./quad-tree').QuadTree,
      Cell     = root.Cell     || require('./quad-tree').Cell
      
  if (Cell.prototype.generation === undefined) {
    require('./children');
  }

  function mapConcat (choices) {
    return function (list) {
      return A.map(choices, function (choice) {
        return list.concat([choice])
      })
    }
  }

  function flatMapWith (fn, list) {
    return A.foldl(list, function (acc, element) {
      return acc.concat(fn(element));
    }, [])
  }

  function unit (choices) {
    return A.map(choices, function (choice) {
      return [choice];
    });
  }

  function forChoices (choices) {
    var chooser = A.call(flatMapWith, mapConcat(choices));
    return A.map(
      A.compose(chooser, chooser, chooser)(unit(choices)),
      function (children) { return new QuadTree(children); });
  }

  function all (generation) {
    if (generation === 0) {
      return [Cell(0), Cell(1)];
    }
    else return forChoices(all(generation - 1));
  }

  var generationTwoFuture = (function () {

    var TABLE = [
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0]
    ];

    return function generationTwoFuture () {
      var nw = this.nw(),
          ne = this.ne(),
          se = this.se(),
          sw = this.sw();

      var nwState = nw.se().id,
          neState = ne.sw().id,
          seState = se.nw().id,
          swState = sw.ne().id;

      // includes +2 if self is alive
      var nwCount = nw.nw().id + nw.ne().id + ne.nw().id
                  + nw.sw().id              + ne.sw().id
                  + sw.nw().id + sw.ne().id + se.nw().id,

          neCount = nw.ne().id + ne.nw().id + ne.ne().id
                  + nw.se().id              + ne.se().id
                  + sw.ne().id + se.nw().id + se.ne().id,

          seCount = nw.se().id + ne.sw().id + ne.se().id
                  + sw.ne().id              + se.ne().id
                  + sw.se().id + se.sw().id + se.se().id,

          swCount = nw.sw().id + nw.se().id + ne.sw().id
                  + sw.nw().id              + se.nw().id
                  + sw.sw().id + sw.se().id + se.sw().id;

      var nwNext  = TABLE[nwState][nwCount],
          neNext  = TABLE[neState][neCount],
          seNext  = TABLE[seState][seCount],
          swNext  = TABLE[swState][swCount];

      var nwCell  = Cell(nwNext),
          neCell  = Cell(neNext),
          seCell  = Cell(seNext),
          swCell  = Cell(swNext);

      return new QuadTree([
        nwCell, neCell, seCell, swCell
      ]);
    }

  })();

  // ....|....
  // ....|....    ...|...
  // ....|....    ...|...
  // ....|....    ...|...
  // ----+---- => ---+---
  // ....|....    ...|...
  // ....|....    ...|...
  // ....|....    ...|...
  // ....|....

  // ....|....
  // ....|....    ...|...
  // ..**|....    ...|...
  // ..**|....    ...|...
  // ----+---- => ---+---
  // ....|....    ...|...
  // ....|....    ...|...
  // ....|....    ...|...
  // ....|....

  function maximumFuture () {
  
    // calculate the futures of all the children:
    
    var nw = this.nw().future(),
        ne = this.ne().future(),
        se = this.se().future(),
        sw = this.sw().future(),
        nn = this.nn().future(),
        ee = this.ee().future(),
        ss = this.ss().future(),
        ww = this.ww().future(),
        cc = this.cc().future();
        
    // build four "overlapping" trees and get their futures:
    
    var large_nw = new QuadTree([nw, nn, cc, ww]).future(),
        large_ne = new QuadTree([nn, ne, ee, cc]).future(),
        large_se = new QuadTree([cc, ee, se, ss]).future(),
        large_sw = new QuadTree([ww, cc, ss, sw]).future();
        
    // return our future:
    
    return new QuadTree([large_nw, large_ne, large_se, large_sw]);
    
  };

  A.extendClass(QuadTree, {
    future: function () {
      if (this._future) {
        return this._future;
      }
      else if (this.generation === 1) {
        throw "Too small to have a future";
      }
      else if (this.generation === 2) {
        return (this._future = generationTwoFuture.call(this))
      }
      else return (this._future = maximumFuture.call(this));
    },
    futureAt: function (t) {
      var max = this.maximumGenerations();
      
      if (t === 0) {
        return new QuadTree([
          this.nw().se(),
          this.ne().sw(),
          this.se().nw(),
          this.sw().ne()
        ]);
      }
      else if (t <= Math.pow(2, this.generation - 3)) {
        var nw = this.nw().futureAt(t),
            ne = this.ne().futureAt(t),
            se = this.se().futureAt(t),
            sw = this.sw().futureAt(t),
            nn = this.nn().futureAt(t),
            ee = this.ee().futureAt(t),
            ss = this.ss().futureAt(t),
            ww = this.ww().futureAt(t),
            cc = this.cc().futureAt(t);
    
        var onw = new QuadTree([nw, nn, cc, ww]).futureAt(0),
            one = new QuadTree([nn, ne, ee, cc]).futureAt(0),
            ose = new QuadTree([cc, ee, se, ss]).futureAt(0),
            osw = new QuadTree([ww, cc, ss, sw]).futureAt(0);
            
        return new QuadTree([onw, one, ose, osw]);
      }
      else if (t < max) {
        var nw = this.nw().future(),
            ne = this.ne().future(),
            se = this.se().future(),
            sw = this.sw().future(),
            nn = this.nn().future(),
            ee = this.ee().future(),
            ss = this.ss().future(),
            ww = this.ww().future(),
            cc = this.cc().future();
    
        var onw = new QuadTree([nw, nn, cc, ww]).futureAt(t - Math.pow(2, this.generation - 3)),
            one = new QuadTree([nn, ne, ee, cc]).futureAt(t - Math.pow(2, this.generation - 3)),
            ose = new QuadTree([cc, ee, se, ss]).futureAt(t - Math.pow(2, this.generation - 3)),
            osw = new QuadTree([ww, cc, ss, sw]).futureAt(t - Math.pow(2, this.generation - 3));
            
        return new QuadTree([onw, one, ose, osw]);
      }
      else if (t === max)
        return this.future();
      else if (t > max)
        throw "Too big!";
    },
    maximumGenerations: function () {
      return Math.ceil(Math.pow(2, this.generation - 2));
    }
  })

  A.extend(QuadTree, {
    all: all
  });

})(this);
