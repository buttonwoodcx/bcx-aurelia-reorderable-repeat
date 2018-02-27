import {DOM, PLATFORM} from 'aurelia-pal';

import {ReorderableRepeat} from './reorderable-repeat';
import {ReorderableDirection} from './reorderable-direction';
import {ReorderableDndPreview} from './reorderable-dnd-preview';
import {ReorderableDndHandlerSelector} from './reorderable-dnd-handler-selector';
import {ReorderableAfterReordering} from './reorderable-after-reordering';

const css = `
.reorderable-repeat-dragging-me {
  visibility: hidden;
}
`;

export function configure(config) {
  DOM.injectStyles(css);

  config.globalResources([
    PLATFORM.moduleName('./reorderable-repeat'),
    PLATFORM.moduleName('./reorderable-direction'),
    PLATFORM.moduleName('./reorderable-dnd-preview'),
    PLATFORM.moduleName('./reorderable-dnd-handler-selector'),
    PLATFORM.moduleName('./reorderable-after-reordering'),
  ]);
}

export {
  ReorderableRepeat,
  ReorderableDirection,
  ReorderableDndPreview,
  ReorderableDndHandlerSelector,
  ReorderableAfterReordering
};
