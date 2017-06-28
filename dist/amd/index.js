define(['exports', 'aurelia-pal', './reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering'], function (exports, _aureliaPal, _reorderableRepeat, _reorderableDirection, _reorderableDndPreview, _reorderableDndHandlerSelector, _reorderableAfterReordering) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ReorderableAfterReordering = exports.ReorderableDndHandlerSelector = exports.ReorderableDndPreview = exports.ReorderableDirection = exports.ReorderableRepeat = undefined;
  exports.configure = configure;

  var css = '\n.reorderable-repeat-dragging-me {\n  visibility: hidden;\n}\n';

  function configure(config) {
    _aureliaPal.DOM.injectStyles(css);

    config.globalResources(['./reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering']);
  }

  exports.ReorderableRepeat = _reorderableRepeat.ReorderableRepeat;
  exports.ReorderableDirection = _reorderableDirection.ReorderableDirection;
  exports.ReorderableDndPreview = _reorderableDndPreview.ReorderableDndPreview;
  exports.ReorderableDndHandlerSelector = _reorderableDndHandlerSelector.ReorderableDndHandlerSelector;
  exports.ReorderableAfterReordering = _reorderableAfterReordering.ReorderableAfterReordering;
});