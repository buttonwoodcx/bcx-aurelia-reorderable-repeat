var _dec, _class;

import { customAttribute } from 'aurelia-templating';

export let ReorderableDirection = (_dec = customAttribute('reorderable-direction'), _dec(_class = class ReorderableDirection {

  constructor() {}

  attached() {}

  bind(bindingContext, overrideContext) {
    this.scope = { bindingContext, overrideContext };
  }

}) || _class);