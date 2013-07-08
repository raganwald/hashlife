(function (root) {
  
  var __slice = [].slice;

  var _ = root._ || require('../vendor/underscore');
  
  var A = (root.allong && root.allong.es) || require('../vendor/allong.es.browser').allong.es;

  var QuadTree = root.QuadTree || require('./quad-tree').QuadTree,
      Cell     = root.Cell     || require('./quad-tree').Cell

  A.extendClass(Cell, {
    toJSON: function () {
      return this.id;
    }
  });

  A.extendClass(QuadTree, {
    toJSON: function () {
      var childrenJSON = A.map(this.children, '.toJSON()');
      if (this.generation === 1) {
        return [[childrenJSON[0], childrenJSON[1]], [childrenJSON[3], childrenJSON[2]]];
      }
      else {
        var topHalf = A.map(_.zip(childrenJSON[0], childrenJSON[1]), function (pair) {
          return pair[0].concat(pair[1]);
        });
        var bottomHalf = A.map(_.zip(childrenJSON[3], childrenJSON[2]), function (pair) {
          return pair[0].concat(pair[1]);
        });
        return topHalf.concat(bottomHalf);
      }
    }
  });

  A.extend(QuadTree, {
    fromString: function() {
      var json, sz, strs = __slice.call(arguments, 0);
      if (strs.length === 1) {
        sz = Math.sqrt(str.length);
        while (strs[0].length > sz) {
          strs.push(strs[0].slice(0, sz));
          strs[0] = strs[0].slice(sz);
        }
        strs.push(strs.shift());
      }
      json = _.map(strs, function(ln) {
        var c, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = ln.length; _i < _len; _i++) {
          c = ln[_i];
          _results.push({
            '.': 0,
            ' ': 0,
            'O': 1,
            '+': 1,
            '*': 1
          }[c]);
        }
        return _results;
      });
      return this.fromJSON(json);
    },
    fromJSON: function(json) {
      var dims, half_length, sz, _i, _j, _ref, _ref1, _results, _results1;
      dims = [json.length].concat(json.map(function(row) {
        return row.length;
      }));
      sz = Math.pow(2, Math.ceil(Math.log(Math.max.apply(Math, dims)) / Math.log(2)));
      _.each((function() {
        _results = [];
        for (var _i = 0, _ref = json.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), function(i) {
        var _j, _ref1, _results1;
        if (json[i].length < sz) {
          return json[i] = json[i].concat(A.map((function() {
            _results1 = [];
            for (var _j = 1, _ref1 = sz - json[i].length; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; 1 <= _ref1 ? _j++ : _j--){ _results1.push(_j); }
            return _results1;
          }).apply(this), function() {
            return 0;
          }));
        }
      });
      if (json.length < sz) {
        json = json.concat(A.map((function() {
          _results1 = [];
          for (var _j = 1, _ref1 = sz - json.length; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; 1 <= _ref1 ? _j++ : _j--){ _results1.push(_j); }
          return _results1;
        }).apply(this), function() {
          var _k, _results2;
          return A.map((function() {
            _results2 = [];
            for (var _k = 1; 1 <= sz ? _k <= sz : _k >= sz; 1 <= sz ? _k++ : _k--){ _results2.push(_k); }
            return _results2;
          }).apply(this), function() {
            return 0;
          });
        }));
      }
      if (json.length === 1) {
        if (json[0][0] instanceof Cell) {
          return json[0][0];
        } else if (json[0][0] === 0) {
          return Cell(0);
        } else if (json[0][0] === 1) {
          return Cell(1);
        } else {
          throw 'a 1x1 square must contain a zero, one, or Cell';
        }
      } else {
        half_length = json.length / 2;
        return new QuadTree([
          this.fromJSON(json.slice(0, half_length).map(function(row) {
            return row.slice(0, half_length);
          })),
          this.fromJSON(json.slice(0, half_length).map(function(row) {
            return row.slice(half_length);
          })),
          this.fromJSON(json.slice(half_length).map(function(row) {
            return row.slice(half_length);
          })),
          this.fromJSON(json.slice(half_length).map(function(row) {
            return row.slice(0, half_length);
          }))
        ]);
      }
    }
  });

})(this);