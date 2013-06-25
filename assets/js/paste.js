(function (root) {

  var _ = root._ || require('../vendor/underscore');

  if (_.isUndefined(_.arity)) {
    require('../vendor/underscore-contrib');
  }

  var QuadTree = root.QuadTree || require('./quad-tree').QuadTree,
      Cell     = root.Cell     || require('./quad-tree').Cell

  if (_.isUndefined(Cell.prototype.generation)) {
    require('./children');
  }

  if (_.isUndefined(QuadTree.prototype.toJSON)) {
    require('./json');
  }

  _.extend(QuadTree.prototype, {
    paste: function (content, xCentre, yCentre) {
      if (!(content instanceof QuadTree)) throw "non-square pastes not implemented yet";

      if (content.generation === this.generation) {
        if (xCentre === 0 && yCentre === 0) {
          return content;
        }
        else throw "same size but offset, unexpected."
      }

      var halfSelfWidth = this.width / 2,
          halfPasteWidth = content.width / 2,
          upperLeft = {
            x: xCentre - halfPasteWidth,
            y: yCentre - halfPasteWidth
          },
          lowerRight = {
            x: xCentre + halfPasteWidth,
            y: yCentre + halfPasteWidth
          }

      if (Math.abs(upperLeft.x) > halfSelfWidth) return;
      if (Math.abs(upperLeft.y) > halfSelfWidth) return;
      if (Math.abs(lowerRight.x) > halfSelfWidth) return;
      if (Math.abs(lowerRight.y) > halfSelfWidth) return;

      var ewIndex,
          nsIndex,
          upperLeftRelativeToChild,
          lowerRightRelativeToChild,
          xRelativeToChild,
          yRelativeToChild,
          child,
          pastedChild,
          extant = this.width / 2
          childExtant = extant / 2;

      // TODO: Could this be a functoinal iterator?
      for (ewIndex = -1; ewIndex < 2; ++ewIndex) {
        for (nsIndex = -1; nsIndex < 2; ++nsIndex) {

          upperLeftRelativeToChild = {
            x: upperLeft.x - (ewIndex * childExtant),
            y: upperLeft.y - (nsIndex * childExtant)
          };

          if (Math.abs(upperLeftRelativeToChild.x) > childExtant) continue;
          if (Math.abs(upperLeftRelativeToChild.y) > childExtant) continue;

          lowerRightRelativeToChild = {
            x: lowerRight.x - (ewIndex * childExtant),
            y: lowerRight.y - (nsIndex * childExtant)
          }

          if (Math.abs(lowerRightRelativeToChild.x) > childExtant) continue;
          if (Math.abs(lowerRightRelativeToChild.y) > childExtant) continue;

          child = this.subTreeByIndices(ewIndex, nsIndex);

          xRelativeToChild = xCentre - (ewIndex * childExtant);
          yRelativeToChild = yCentre - (nsIndex * childExtant);

          pastedChild = child.paste(content, xRelativeToChild, yRelativeToChild);

          // one subtree
          if (nsIndex === -1 && ewIndex === -1) {
            return new QuadTree([pastedChild, this.ne(), this.se(), this.sw()]);
          }
          else if (nsIndex === -1 && ewIndex === 1) {
            return new QuadTree([this.nw(), pastedChild, this.se(), this.sw()]);
          }
          else if (nsIndex === 1 && ewIndex === 1) {
            return new QuadTree([this.nw(), this.ne(), pastedChild, this.sw()]);
          }
          else if (nsIndex === 1 && ewIndex === -1) {
            return new QuadTree([this.nw(), this.ne(), this.se(), pastedChild]);
          }
          else if (nsIndex === -1 && ewIndex === 0) { // nn
            return new QuadTree([
              new QuadTree([this.nw().nw(), pastedChild.nw(), pastedChild.sw(), this.nw().sw()]),
              new QuadTree([pastedChild.ne(), this.ne().ne(), this.ne().se(), pastedChild.sw()]),
              this.se(),
              this.sw()
            ]);
          }
          else if (nsIndex === 1 && ewIndex === 0) { // ss
            return new QuadTree([
              this.nw(),
              this.ne(),
              new QuadTree([pastedChild.ne(), this.se().ne(), this.se().se(), pastedChild.se()]),
              new QuadTree([this.sw().nw(), pastedChild.nw(), pastedChild.sw(), this.sw().sw()])
            ]);
          }
          else if (nsIndex === 0 && ewIndex === -1) { // ee
            return new QuadTree([
              new QuadTree([this.nw().nw(), this.nw().ne(), pastedChild.ne(), pastedChild.nw()]),
              this.ne(),
              this.se(),
              new QuadTree([pastedChild.sw(), pastedChild.se(), this.sw().se(), this.sw().sw()])
            ]);
          }
          else if (nsIndex === 0 && ewIndex === 1) { // ww
            return new QuadTree([
              this.nw(),
              new QuadTree([this.ne().nw(), this.ne().ne(), pastedChild.ne(), pastedChild.nw()]),
              new QuadTree([pastedChild.sw(), pastedChild.se(), this.se().se(), this.se().sw()]),
              this.sw()
            ]);
          }
          else { // (nsIndex === 0 && ewIndex === 0) // cc
            return new QuadTree([
              new QuadTree([this.nw().nw(), this.nw().ne(), pastedChild.nw(), this.nw().sw()]),
              new QuadTree([this.ne().nw(), this.ne().ne(), this.ne().ne(), pastedChild.ne()]),
              new QuadTree([pastedChild.se(), this.se().ne(), this.se().se(), this.se().sw()]),
              new QuadTree([this.sw().nw(), pastedChild.sw(), this.sw().se(), this.sw().sw()])
            ]);
          }
        }
      }
      // We'll brute-force it
      return (function () {
        
        var resultJSON = this.toJSON(),
            contentJSON = content.toJSON();
        
        _.each(contentJSON, function (contentRow, rowIndex) {
          var resultRow = resultJSON[extant + upperLeft.y + rowIndex];
          
          _.each(contentRow, function (contentCell, columnIndex) {
            resultRow[extant + upperLeft.x + columnIndex] = contentCell;
          });
        });
        
        return QuadTree.fromJSON(resultJSON);
        
      }).call(this);
    }
  });

})(this);