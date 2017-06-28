'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReorderableDndHandlerSelector = undefined;

var _dec, _class;

var _aureliaTemplating = require('aurelia-templating');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReorderableDndHandlerSelector = exports.ReorderableDndHandlerSelector = (_dec = (0, _aureliaTemplating.customAttribute)('reorderable-dnd-handler-selector'), _dec(_class = function () {
  function ReorderableDndHandlerSelector() {
    _classCallCheck(this, ReorderableDndHandlerSelector);
  }

  ReorderableDndHandlerSelector.prototype.attached = function attached() {};

  ReorderableDndHandlerSelector.prototype.bind = function bind(bindingContext, overrideContext) {
    this.scope = { bindingContext: bindingContext, overrideContext: overrideContext };
  };

  return ReorderableDndHandlerSelector;
}()) || _class);