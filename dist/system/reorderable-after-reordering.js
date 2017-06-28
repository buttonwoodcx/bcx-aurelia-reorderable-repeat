'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  "use strict";

  var customAttribute, _dec, _class, ReorderableAfterReordering;

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
      _export('ReorderableAfterReordering', ReorderableAfterReordering = (_dec = customAttribute('reorderable-after-reordering'), _dec(_class = function () {
        function ReorderableAfterReordering() {
          _classCallCheck(this, ReorderableAfterReordering);
        }

        ReorderableAfterReordering.prototype.attached = function attached() {};

        ReorderableAfterReordering.prototype.bind = function bind(bindingContext, overrideContext) {
          this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
        };

        return ReorderableAfterReordering;
      }()) || _class));

      _export('ReorderableAfterReordering', ReorderableAfterReordering);
    }
  };
});