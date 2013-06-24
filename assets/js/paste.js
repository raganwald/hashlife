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
          childExtant = this.width / 4;

      // TODO: Could this be a functoinal iterator?
      for (nsIndex = -1; nsIndex < 2; ++nsIndex) {
        for (ewIndex = -1; ewIndex < 2; ++ewIndex) {

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
          
          if (child === this.nw()) {
            return new QuadTree([pastedChild, this.ne(), this.se(), this.sw()]);
          }
          else if (child === this.ne()) {
            return new QuadTree([this.nw(), pastedChild, this.se(), this.sw()]);
          }
          else if (child === this.se()) {
            return new QuadTree([this.nw(), this.ne(), pastedChild, this.sw()]);
          }
          else if (child === this.sw()) {
            return new QuadTree([this.nw(), this.ne(), this.se(), pastedChild]);
          }
          else throw "Not implemented yet!"
        }
      }
    }
  });

})(this);