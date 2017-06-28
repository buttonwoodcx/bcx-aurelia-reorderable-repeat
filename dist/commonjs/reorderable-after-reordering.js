'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReorderableAfterReordering = undefined;

var _dec, _class;

var _aureliaTemplating = require('aurelia-templating');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReorderableAfterReordering = exports.ReorderableAfterReordering = (_dec = (0, _aureliaTemplating.customAttribute)('reorderable-after-reordering'), _dec(_class = function () {
  function ReorderableAfterReordering() {
    _classCallCheck(this, ReorderableAfterReordering);
  }

  ReorderableAfterReordering.prototype.attached = function attached() {};

  ReorderableAfterReordering.prototype.bind = function bind(bindingContext, overrideContext) {
    this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
  };

  return ReorderableAfterReordering;
}()) || _class);