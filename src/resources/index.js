import {DOM} from 'aurelia-pal';
import {ReorderableRepeat} from './reorderable-repeat';
import {ReorderableDirection} from './reorderable-direction';
import {ReorderableGroup} from './reorderable-group';
import {ReorderableGroupFor} from './reorderable-group-for';
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
    ReorderableRepeat,
    ReorderableDirection,
    ReorderableGroup,
    ReorderableGroupFor,
    ReorderableDndPreview,
    ReorderableDndHandlerSelector,
    ReorderableAfterReordering
  ]);
}
