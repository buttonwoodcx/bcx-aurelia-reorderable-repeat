'use strict';

System.register(['aurelia-pal'], function (_export, _context) {
  "use strict";

  var DOM, css;
  function configure(config) {
    DOM.injectStyles(css);

    config.globalResources(['./reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering']);
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
    }],
    execute: function () {
      css = '\n.reorderable-repeat-dragging-me {\n  visibility: hidden;\n}\n';
    }
  };
});