'use strict';

System.register(['./simple-array-repeat-strategy'], function (_export, _context) {
  "use strict";

  var SimpleArrayRepeatStrategy, ReorderableRepeatStrategyLocator;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_simpleArrayRepeatStrategy) {
      SimpleArrayRepeatStrategy = _simpleArrayRepeatStrategy.SimpleArrayRepeatStrategy;
    }],
    execute: function () {
      _export('ReorderableRepeatStrategyLocator', ReorderableRepeatStrategyLocator = function () {
        function ReorderableRepeatStrategyLocator() {
          _classCallCheck(this, ReorderableRepeatStrategyLocator);

          this.matchers = [];
          this.strategies = [];
          this.addStrategy(function (items) {
            return items instanceof Array;
          }, new SimpleArrayRepeatStrategy());
        }

        ReorderableRepeatStrategyLocator.prototype.addStrategy = function addStrategy(matcher, strategy) {
          this.matchers.push(matcher);
          this.strategies.push(strategy);
        };

        ReorderableRepeatStrategyLocator.prototype.getStrategy = function getStrategy(items) {
          var matchers = this.matchers;

          for (var i = 0, ii = matchers.length; i < ii; ++i) {
            if (matchers[i](items)) {
              return this.strategies[i];
            }
          }

          return null;
        };

        return ReorderableRepeatStrategyLocator;
      }());

      _export('ReorderableRepeatStrategyLocator', ReorderableRepeatStrategyLocator);
    }
  };
});