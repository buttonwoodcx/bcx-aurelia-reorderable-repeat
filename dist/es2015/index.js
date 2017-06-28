import { DOM } from 'aurelia-pal';

const css = `
.reorderable-repeat-dragging-me {
  visibility: hidden;
}
`;

export function configure(config) {
  DOM.injectStyles(css);

  config.globalResources(['./reorderable-repeat', './reorderable-direction', './reorderable-dnd-preview', './reorderable-dnd-handler-selector', './reorderable-after-reordering']);
}