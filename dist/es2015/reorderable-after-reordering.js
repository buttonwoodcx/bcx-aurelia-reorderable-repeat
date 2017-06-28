var _dec, _class;

import { customAttribute } from 'aurelia-templating';

export let ReorderableAfterReordering = (_dec = customAttribute('reorderable-after-reordering'), _dec(_class = class ReorderableAfterReordering {

  constructor() {}

  attached() {}

  bind(bindingContext, overrideContext) {
    this.scope = { bindingContext, overrideContext };
  }

}) || _class);