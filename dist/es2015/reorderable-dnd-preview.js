var _dec, _class;

import { customAttribute } from 'aurelia-templating';

export let ReorderableDndPreview = (_dec = customAttribute('reorderable-dnd-preview'), _dec(_class = class ReorderableDndPreview {

  constructor() {}

  attached() {}

  bind(bindingContext, overrideContext) {
    this.scope = { bindingContext, overrideContext };
  }

}) || _class);