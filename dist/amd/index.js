define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources(['./reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering']);
  }
});