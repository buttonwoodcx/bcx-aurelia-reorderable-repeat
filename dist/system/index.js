'use strict';

System.register(['aurelia-pal', './reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering'], function (_export, _context) {
  "use strict";

  var DOM, ReorderableRepeat, ReorderableDirection, ReorderableDndPreview, ReorderableDndHandlerSelector, ReorderableAfterReordering, css;
  function configure(config) {
    DOM.injectStyles(css);

    config.globalResources(['./reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering']);
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }, function (_reorderableRepeat) {
      ReorderableRepeat = _reorderableRepeat.ReorderableRepeat;
    }, function (_reorderableDirection) {
      ReorderableDirection = _reorderableDirection.ReorderableDirection;
    }, function (_reorderableDndPreview) {
      ReorderableDndPreview = _reorderableDndPreview.ReorderableDndPreview;
    }, function (_reorderableDndHandlerSelector) {
      ReorderableDndHandlerSelector = _reorderableDndHandlerSelector.ReorderableDndHandlerSelector;
    }, function (_reorderableAfterReordering) {
      ReorderableAfterReordering = _reorderableAfterReordering.ReorderableAfterReordering;
    }],
    execute: function () {
      css = '\n.reorderable-repeat-dragging-me {\n  visibility: hidden;\n}\n';

      _export('ReorderableRepeat', ReorderableRepeat);

      _export('ReorderableDirection', ReorderableDirection);

      _export('ReorderableDndPreview', ReorderableDndPreview);

      _export('ReorderableDndHandlerSelector', ReorderableDndHandlerSelector);

      _export('ReorderableAfterReordering', ReorderableAfterReordering);
    }
  };
});