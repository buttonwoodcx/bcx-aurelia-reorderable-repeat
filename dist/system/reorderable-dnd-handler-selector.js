'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  "use strict";

  var customAttribute, _dec, _class, ReorderableDndHandlerSelector;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }],
    execute: function () {
      _export('ReorderableDndHandlerSelector', ReorderableDndHandlerSelector = (_dec = customAttribute('reorderable-dnd-handler-selector'), _dec(_class = function () {
        function ReorderableDndHandlerSelector() {
          _classCallCheck(this, ReorderableDndHandlerSelector);
        }

        ReorderableDndHandlerSelector.prototype.attached = function attached() {};

        ReorderableDndHandlerSelector.prototype.bind = function bind(bindingContext, overrideContext) {
          this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
        };

        return ReorderableDndHandlerSelector;
      }()) || _class));

      _export('ReorderableDndHandlerSelector', ReorderableDndHandlerSelector);
    }
  };
});