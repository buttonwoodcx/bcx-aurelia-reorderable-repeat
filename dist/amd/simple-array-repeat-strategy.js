define(['exports', 'aurelia-templating-resources'], function (exports, _aureliaTemplatingResources) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SimpleArrayRepeatStrategy = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var SimpleArrayRepeatStrategy = exports.SimpleArrayRepeatStrategy = function () {
    function SimpleArrayRepeatStrategy() {
      _classCallCheck(this, SimpleArrayRepeatStrategy);
    }

    SimpleArrayRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
      return observerLocator.getArrayObserver(items);
    };

    SimpleArrayRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
      repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);

      var itemsLength = items.length;
      if (items && itemsLength > 0) {
        this._standardProcessInstanceChanged(repeat, items);
      }
    };

    SimpleArrayRepeatStrategy.prototype._standardProcessInstanceChanged = function _standardProcessInstanceChanged(repeat, items) {
      for (var i = 0, ii = items.length; i < ii; i++) {
        var overrideContext = (0, _aureliaTemplatingResources.createFullOverrideContext)(repeat, items[i], i, ii);
        repeat.addView(overrideContext.bindingContext, overrideContext);
      }
    };

    return SimpleArrayRepeatStrategy;
  }();
});