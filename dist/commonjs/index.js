'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;

var _aureliaPal = require('aurelia-pal');

var css = '\n.reorderable-repeat-dragging-me {\n  visibility: hidden;\n}\n';

function configure(config) {
  _aureliaPal.DOM.injectStyles(css);

  config.globalResources(['./reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering']);
}