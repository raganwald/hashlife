(function (root) {

  var _ = root._ || require('../vendor/underscore');

  if (_.isUndefined(_.arity)) {
    require('../vendor/underscore-contrib');
  }

  var QuadTree = root.QuadTree || require('./quad-tree').QuadTree,
      Cell     = root.Cell     || require('./quad-tree').Cell

  if (_.isUndefined(QuadTree.prototype.toJSON)) {
    require('./json');
  }

  QuadTree.Library || (QuadTree.Library = {});

  _.extend(QuadTree.Library, {

    GosperGliderGunSE: QuadTree.fromString(
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '.....................................*..........................',
      '...................................*.*..........................',
      '.........................**......**............**...............',
      '........................*...*....**............**...............',
      '.............**........*.....*...**.............................',
      '.............**........*...*.**....*.*..........................',
      '.......................*.....*.......*..........................',
      '........................*...*...................................',
      '.........................**.....................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................',
      '................................................................'
    )

  });

})(this);