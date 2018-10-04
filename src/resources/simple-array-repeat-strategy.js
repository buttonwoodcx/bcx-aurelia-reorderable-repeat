import {createFullOverrideContext} from 'aurelia-templating-resources';

// dumbest array repeat strategy
export class SimpleArrayRepeatStrategy {
  getCollectionObserver(observerLocator, items) {
    return observerLocator.getArrayObserver(items);
  }

  instanceChanged(repeat, items) {
    repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);

    const itemsLength = items.length;
    if (items && itemsLength > 0) {
      this._standardProcessInstanceChanged(repeat, items);
    }
  }

  _standardProcessInstanceChanged(repeat, items) {
    for (let i = 0, ii = items.length; i < ii; i++) {
      let overrideContext = createFullOverrideContext(repeat, items[i], i, ii);
      repeat.addView(overrideContext.bindingContext, overrideContext);
    }
  }
}
