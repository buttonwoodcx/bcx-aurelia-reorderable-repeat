'use strict';

System.register([], function (_export, _context) {
  "use strict";

  function configure(config) {
    config.globalResources(['./reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering']);
  }

  _export('configure', configure);

  return {
    setters: [],
    execute: function () {}
  };
});