'use strict';

System.register(['aurelia-templating'], function (_export, _context) {
  "use strict";

  var customAttribute, _dec, _class, ReorderableDndPreview;

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
      _export('ReorderableDndPreview', ReorderableDndPreview = (_dec = customAttribute('reorderable-dnd-preview'), _dec(_class = function () {
        function ReorderableDndPreview() {
          _classCallCheck(this, ReorderableDndPreview);
        }

        ReorderableDndPreview.prototype.attached = function attached() {};

        ReorderableDndPreview.prototype.bind = function bind(bindingContext, overrideContext) {
          this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
        };

        return ReorderableDndPreview;
      }()) || _class));

      _export('ReorderableDndPreview', ReorderableDndPreview);
    }
  };
});