var _dec, _class;

import { customAttribute } from 'aurelia-templating';

export let ReorderableDndHandlerSelector = (_dec = customAttribute('reorderable-dnd-handler-selector'), _dec(_class = class ReorderableDndHandlerSelector {

  constructor() {}

  attached() {}

  bind(bindingContext, overrideContext) {
    this.scope = { bindingContext, overrideContext };
  }

}) || _class);