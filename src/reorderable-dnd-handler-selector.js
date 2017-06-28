import {customAttribute} from 'aurelia-templating';

//Placeholder attribute to prohibit use of this attribute name in other places

@customAttribute('reorderable-dnd-handler-selector')
export class ReorderableDndHandlerSelector {

  constructor() {}

  attached() {}

  bind(bindingContext, overrideContext): void {
    this.scope = { bindingContext, overrideContext };
  }

}
