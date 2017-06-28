import { DOM } from 'aurelia-pal';

import { ReorderableRepeat } from './reorderable-repeat';
import { ReorderableDirection } from './reorderable-direction';
import { ReorderableDndPreview } from './reorderable-dnd-preview';
import { ReorderableDndHandlerSelector } from './reorderable-dnd-handler-selector';
import { ReorderableAfterReordering } from './reorderable-after-reordering';

const css = `
.reorderable-repeat-dragging-me {
  visibility: hidden;
}
`;

export function configure(config) {
  DOM.injectStyles(css);

  config.globalResources(['./reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering']);
}

export { ReorderableRepeat, ReorderableDirection, ReorderableDndPreview, ReorderableDndHandlerSelector, ReorderableAfterReordering };