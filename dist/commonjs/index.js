'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReorderableAfterReordering = exports.ReorderableDndHandlerSelector = exports.ReorderableDndPreview = exports.ReorderableDirection = exports.ReorderableRepeat = undefined;
exports.configure = configure;

var _aureliaPal = require('aurelia-pal');

var _reorderableRepeat = require('./reorderable-repeat');

var _reorderableDirection = require('./reorderable-direction');

var _reorderableDndPreview = require('./reorderable-dnd-preview');

var _reorderableDndHandlerSelector = require('./reorderable-dnd-handler-selector');

var _reorderableAfterReordering = require('./reorderable-after-reordering');

var css = '\n.reorderable-repeat-dragging-me {\n  visibility: hidden;\n}\n';

function configure(config) {
  _aureliaPal.DOM.injectStyles(css);

  config.globalResources([_aureliaPal.PLATFORM.moduleName('./reorderable-repeat'), _aureliaPal.PLATFORM.moduleName('./reorderable-direction'), _aureliaPal.PLATFORM.moduleName('./reorderable-dnd-preview'), _aureliaPal.PLATFORM.moduleName('./reorderable-dnd-handler-selector'), _aureliaPal.PLATFORM.moduleName('./reorderable-after-reordering')]);
}

exports.ReorderableRepeat = _reorderableRepeat.ReorderableRepeat;
exports.ReorderableDirection = _reorderableDirection.ReorderableDirection;
exports.ReorderableDndPreview = _reorderableDndPreview.ReorderableDndPreview;
exports.ReorderableDndHandlerSelector = _reorderableDndHandlerSelector.ReorderableDndHandlerSelector;
exports.ReorderableAfterReordering = _reorderableAfterReordering.ReorderableAfterReordering;