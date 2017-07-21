'use strict';

System.register(['aurelia-templating-resources'], function (_export, _context) {
  "use strict";

  var createFullOverrideContext, SimpleArrayRepeatStrategy;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaTemplatingResources) {
      createFullOverrideContext = _aureliaTemplatingResources.createFullOverrideContext;
    }],
    execute: function () {
      _export('SimpleArrayRepeatStrategy', SimpleArrayRepeatStrategy = function () {
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
            var overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
            repeat.addView(overrideContext.bindingContext, overrideContext);
          }
        };

        return SimpleArrayRepeatStrategy;
      }());

      _export('SimpleArrayRepeatStrategy', SimpleArrayRepeatStrategy);
    }
  };
});