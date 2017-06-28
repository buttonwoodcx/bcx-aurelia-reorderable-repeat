'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReorderableDndPreview = undefined;

var _dec, _class;

var _aureliaTemplating = require('aurelia-templating');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReorderableDndPreview = exports.ReorderableDndPreview = (_dec = (0, _aureliaTemplating.customAttribute)('reorderable-dnd-preview'), _dec(_class = function () {
  function ReorderableDndPreview() {
    _classCallCheck(this, ReorderableDndPreview);
  }

  ReorderableDndPreview.prototype.attached = function attached() {};

  ReorderableDndPreview.prototype.bind = function bind(bindingContext, overrideContext) {
    this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
  };

  return ReorderableDndPreview;
}()) || _class);