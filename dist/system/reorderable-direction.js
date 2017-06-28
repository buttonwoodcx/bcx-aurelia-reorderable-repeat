'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  "use strict";

  var customAttribute, _dec, _class, ReorderableDirection;

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
      _export('ReorderableDirection', ReorderableDirection = (_dec = customAttribute('reorderable-direction'), _dec(_class = function () {
        function ReorderableDirection() {
          _classCallCheck(this, ReorderableDirection);
        }

        ReorderableDirection.prototype.attached = function attached() {};

        ReorderableDirection.prototype.bind = function bind(bindingContext, overrideContext) {
          this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
        };

        return ReorderableDirection;
      }()) || _class));

      _export('ReorderableDirection', ReorderableDirection);
    }
  };
});