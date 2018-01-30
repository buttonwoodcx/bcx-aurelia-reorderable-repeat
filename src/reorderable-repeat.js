/*eslint no-loop-func:0, no-unused-vars:0*/
import {inject} from 'aurelia-dependency-injection';
import {
  ObserverLocator,
  observable,
  BindingEngine,
  BindingBehavior,
  ValueConverter
} from 'aurelia-binding';
import {
  BoundViewFactory,
  TargetInstruction,
  ViewSlot,
  ViewResources,
  customAttribute,
  bindable,
  templateController
} from 'aurelia-templating';
import {
  getItemsSourceExpression,
  unwrapExpression,
  isOneTime,
  updateOneTimeBinding,
  viewsRequireLifecycle,
  AbstractRepeater
} from 'aurelia-templating-resources';
import {ReorderableRepeatStrategyLocator} from './reorderable-repeat-strategy-locator';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TaskQueue} from 'aurelia-task-queue';

let seed = 0;

const classes = (function() {
  let cache = {};
  let start = '(?:^|\\s)';
  let end = '(?:\\s|$)';

  function lookupClass(className) {
    let cached = cache[className];
    if (cached) {
      cached.lastIndex = 0;
    } else {
      cache[className] = cached = new RegExp(start + className + end, 'g');
    }
    return cached;
  }

  function addClass(el, className) {
    let current = el.className;
    if (!current.length) {
      el.className = className;
    } else if (!lookupClass(className).test(current)) {
      el.className += ' ' + className;
    }
  }

  function rmClass(el, className) {
    el.className = el.className.replace(lookupClass(className), ' ').trim();
  }
  return {add: addClass, rm: rmClass};
}());

/**
* Binding to iterate over iterable objects (Array, Map and Number) to genereate a template for each iteration.
*/
@customAttribute('reorderable-repeat')
@templateController
@inject(EventAggregator, TaskQueue, BindingEngine, DndService, BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, ReorderableRepeatStrategyLocator)
export class ReorderableRepeat extends AbstractRepeater {
  /**
  * List of items to bind the repeater to.
  *
  * @property items
  */
  @bindable items
  /**
  * Local variable which gets assigned on each iteration.
  *
  * @property local
  */
  @bindable local

  @observable intention = null;
  @observable patchedItems;

  /**
 * Creates an instance of Repeat.
 * @param viewFactory The factory generating the view
 * @param instruction The instructions for how the element should be enhanced.
 * @param viewResources Collection of resources used to compile the the views.
 * @param viewSlot The slot the view is injected in to.
 * @param observerLocator The observer locator instance.
 * @param collectionStrategyLocator The strategy locator to locate best strategy to iterate the collection.
 */
  constructor(ea, taskQueue, bindingEngine, dndService, viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator) {
    super({
      local: 'item',
      viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
    });

    this.type = 'reorder-' + seed;
    seed += 1;

    this.ea = ea;
    this.taskQueue = taskQueue;
    this.bindingEngine = bindingEngine;
    this.dndService = dndService;
    this.viewFactory = viewFactory;
    this.instruction = instruction;
    this.viewSlot = viewSlot;
    this.lookupFunctions = viewResources.lookupFunctions;
    this.observerLocator = observerLocator;
    this.strategyLocator = strategyLocator;
    this.ignoreMutation = false;
    this.sourceExpression = getItemsSourceExpression(this.instruction, 'reorderable-repeat.for');
    if (this.sourceExpression instanceof BindingBehavior) {
      throw new Error('BindingBehavior is not supported in reorderable-repeat');
    }
    if (this.sourceExpression instanceof ValueConverter) {
      throw new Error('ValueConverter is not supported in reorderable-repeat');
    }
    if (isOneTime(this.sourceExpression)) {
      throw new Error('oneTime binding is not supported in reorderable-repeat');
    }
    this.viewsRequireLifecycle = viewsRequireLifecycle(viewFactory);
  }

  call(context, changes) {
    this[context](this.items, changes);
  }

  /**
  * Binds the repeat to the binding context and override context.
  * @param bindingContext The binding context.
  * @param overrideContext An override context for binding.
  */
  bind(bindingContext, overrideContext) {
    this.scope = { bindingContext, overrideContext };
    this.matcherBinding = this._captureAndRemoveMatcherBinding();
    this.arrayObserver = this.bindingEngine.collectionObserver(this.items).subscribe(this._itemsMutated.bind(this));
    this._subsribers = [
      this.ea.subscribe('dnd:willStart', () => {
        this.intention = null;
        this.views().forEach(v => {
          classes.rm(v.firstChild, 'reorderable-repeat-reordering');
          classes.rm(v.firstChild, 'reorderable-repeat-dragging-me');
        });
      }),
      this.ea.subscribe('dnd:didEnd', () => {
        this.views().forEach(v => {
          classes.rm(v.firstChild, 'reorderable-repeat-reordering');
          classes.rm(v.firstChild, 'reorderable-repeat-dragging-me');
        });

        if (!this.intention) return;
        const {fromIndex, toIndex} = this.intention;
        this.intention = null;

        if (fromIndex === toIndex) return;

        const item = this.items[fromIndex];
        this.items.splice(fromIndex, 1);
        this.items.splice(toIndex, 0, item);

        const afterReordering = this._reorderableAfterReorderingFunc();
        if (afterReordering) afterReordering(this.items);
      })
    ];
    this.patchedItems = [...this.items];
    this.patchedItemsChanged();
  }

  /**
  * Unbinds the repeat
  */
  unbind() {
    this.scope = null;
    this.items = null;
    this.matcherBinding = null;
    this.viewSlot.removeAll(true);
    if (this.arrayObserver) {
      this.arrayObserver.dispose();
      this.arrayObserver = null;
    }
    this._subsribers.forEach(s => s.dispose());
    this._subsribers = [];
  }

  intentionChanged(newIntention) {
    if (newIntention) {
      const {fromIndex, toIndex} = newIntention;
      let patched = [...this.items];
      const item = this.items[fromIndex];
      patched.splice(fromIndex, 1);
      patched.splice(toIndex, 0, item);
      this.patchedItems = patched;
    }
  }

  /**
  * Invoked everytime the item property changes.
  */
  itemsChanged(newVal, oldVal) {
    // still bound?
    if (!this.scope) {
      return;
    }

    if (this.arrayObserver) {
      this.arrayObserver.dispose();
      this.arrayObserver = null;
    }

    this.arrayObserver = this.bindingEngine.collectionObserver(this.items).subscribe(this._itemsMutated.bind(this));

    if (this.intention === null) {
      this.patchedItems = [...this.items];
    } else {
      this.intention = null;
    }
  }

  _itemsMutated() {
    if (this.intention === null) {
      this.patchedItems = [...this.items];
    } else {
      this.intention = null;
    }
  }

  patchedItemsChanged() {
    // still bound?
    if (!this.scope) {
      return;
    }

    this.strategy = this.strategyLocator.getStrategy(this.patchedItems);
    if (!this.strategy) {
      throw new Error(`Value for '${this.sourceExpression}' is non-repeatable`);
    }

    this.strategy.instanceChanged(this, this.patchedItems);
  }

  _captureAndRemoveMatcherBinding() {
    if (this.viewFactory.viewFactory) {
      const instructions = this.viewFactory.viewFactory.instructions;
      const instructionIds = Object.keys(instructions);
      for (let i = 0; i < instructionIds.length; i++) {
        const expressions = instructions[instructionIds[i]].expressions;
        if (expressions) {
          for (let ii = 0; i < expressions.length; i++) {
            if (expressions[ii].targetProperty === 'matcher') {
              const matcherBinding = expressions[ii];
              expressions.splice(ii, 1);
              return matcherBinding;
            }
          }
        }
      }
    }

    return undefined;
  }

  // @override AbstractRepeater
  viewCount() { return this.viewSlot.children.length; }
  views() { return this.viewSlot.children; }
  view(index) { return this.viewSlot.children[index]; }
  matcher() { return this.matcherBinding ? this.matcherBinding.sourceExpression.evaluate(this.scope, this.matcherBinding.lookupFunctions) : null; }

  addView(bindingContext, overrideContext) {
    let view = this.viewFactory.create();
    window.ttview = view;
    view.bind(bindingContext, overrideContext);
    this.viewSlot.add(view);
    window.ttview = view;
    this._registerDnd(view);
  }

  insertView(index, bindingContext, overrideContext) {
    let view = this.viewFactory.create();
    view.bind(bindingContext, overrideContext);
    this.viewSlot.insert(index, view);
    this._registerDnd(view);
  }

  moveView(sourceIndex, targetIndex) {
    this.viewSlot.move(sourceIndex, targetIndex);
  }

  removeAllViews(returnToCache, skipAnimation) {
    this.views().forEach(view => this._unRegisterDnd(view));
    return this.viewSlot.removeAll(returnToCache, skipAnimation);
  }

  removeViews(viewsToRemove, returnToCache, skipAnimation) {
    viewsToRemove.forEach(view => this._unRegisterDnd(view));
    return this.viewSlot.removeMany(viewsToRemove, returnToCache, skipAnimation);
  }

  removeView(index, returnToCache, skipAnimation) {
    this._unRegisterDnd(this.view(index));
    return this.viewSlot.removeAt(index, returnToCache, skipAnimation);
  }

  updateBindings(view) {
    this._unRegisterDnd(view);

    let j = view.bindings.length;
    while (j--) {
      updateOneTimeBinding(view.bindings[j]);
    }
    j = view.controllers.length;
    while (j--) {
      let k = view.controllers[j].boundProperties.length;
      while (k--) {
        let binding = view.controllers[j].boundProperties[k].binding;
        updateOneTimeBinding(binding);
      }
    }

    this._registerDnd(view);
  }

  _additionalAttribute(view, attribute) {
    return (view &&
            view.firstChild &&
            view.firstChild.au &&
            view.firstChild.au[attribute]) ?
            view.firstChild.au[attribute].instruction.attributes[attribute] :
            undefined;
  }

  _reorderableDirection(view) {
    let attr = this._additionalAttribute(view, 'reorderable-direction');
    if (attr && attr.sourceExpression) {
      attr = attr.sourceExpression.evaluate(this.scope);
    }

    if (typeof attr === 'string') {
      return attr.toLowerCase() || 'down';
    }
    return 'down';
  }

  _dndHandlerSelector(view) {
    let attr = this._additionalAttribute(view, 'reorderable-dnd-handler-selector');
    if (attr && attr.sourceExpression) {
      attr = attr.sourceExpression.evaluate(this.scope);
    }

    if (typeof attr === 'string') {
      return attr;
    }
  }

  _dndPreviewFunc(view) {
    const func = this._additionalAttribute(view, 'reorderable-dnd-preview');

    if (!func) {
      return null;
    } else if (typeof func === 'string') {
      let funcCall = this.scope.overrideContext.bindingContext[func];

      if (typeof funcCall === 'function') {
        return funcCall.bind(this.scope.overrideContext.bindingContext);
      }
      throw new Error("'reorderable-dnd-preview' must be a function or evaluate to one");
    } else if (func.sourceExpression) {
      // TODO test preview
      return (item, scope) => {
        return func.sourceExpression.evaluate(scope);
      };
    } else {
      throw new Error("'reorderable-dnd-preview' must be a function or evaluate to one");
    }
  }

  _reorderableAfterReorderingFunc() {
    const func = this._additionalAttribute(this.view(0), 'reorderable-after-reordering');

    if (!func) {
      return null;
    } else if (typeof func === 'string') {
      let funcCall = this.scope.overrideContext.bindingContext[func];

      if (typeof funcCall === 'function') {
        return funcCall.bind(this.scope.overrideContext.bindingContext);
      }
      throw new Error("'reorderable-after-reordering' must be a function or evaluate to one");
    } else if (func.sourceExpression) {
      // TODO test preview
      return () => func.sourceExpression.evaluate(this.scope);
    } else {
      throw new Error("'reorderable-after-reordering' must be a function or evaluate to one");
    }
  }

  _dndHover(location, index, direction) {
    const {mouseEndAt, targetElementRect} = location;
    const x = mouseEndAt.x - targetElementRect.x;
    const y = mouseEndAt.y - targetElementRect.y;

    let inLeastHalf;

    if (direction === 'left') {
      inLeastHalf = x > (targetElementRect.width / 2);
    } else if (direction === 'right') {
      inLeastHalf = x < (targetElementRect.width / 2);
    } else if (direction === 'up') {
      inLeastHalf = y > (targetElementRect.height / 2);
    } else /* if (direction === 'down') */ {
      inLeastHalf = y < (targetElementRect.height / 2);
    }

    // because of unknown size diff between items,
    // check half size to avoid endless bouncing of swapping two items.
    if (inLeastHalf) {
      // hover over top half, user wants to move smth before this item.
      this._updateIntention(index, true);
    } else {
      // hover over bottom half, user wants to move smth after this item.
      this._updateIntention(index, false);
    }
  }

  _registerDnd(view) {
    const {local} = this;
    const el = view.firstChild;
    const item = view.bindingContext[local];
    const index = view.overrideContext.$index;
    const handlerSelector = this._dndHandlerSelector(view);
    let handler;
    if (handlerSelector) {
      handler = view.firstChild.querySelector(handlerSelector);
    }
    const direction = this._reorderableDirection(view);
    const _previewFunc = this._dndPreviewFunc(view);

    this.dndService.addSource({
      dndModel: () => ({type: this.type, index}),
      dndPreview: _previewFunc && (() => _previewFunc(item, view)),
      dndElement: el
    }, handler && {handler});

    this.dndService.addTarget({
      dndElement: el,
      dndCanDrop: (model) => {
        const canDrop = model.type === this.type &&
                        (this.intention ? (this.intention.toIndex !== index) : (model.index !== index));

        this.taskQueue.queueMicroTask(() => {
          classes.add(el, 'reorderable-repeat-reordering');
        });

        if (model.type === this.type && !canDrop) {
          // hack style
          // I am under dragging
          this.taskQueue.queueMicroTask(() => {
            classes.add(el, 'reorderable-repeat-dragging-me');
          });
        }
        return canDrop;
      },
      dndHover: (location) => {
        this._dndHover(location, index, direction);
      },
      dndDrop() { /* no-op */}
    });
  }

  _unRegisterDnd(view) {
    classes.rm(view.firstChild, 'reorderable-repeat-reordering');
    classes.rm(view.firstChild, 'reorderable-repeat-dragging-me');
    this.dndService.removeSource(view.firstChild);
    this.dndService.removeTarget(view.firstChild);
  }

  _updateIntention(targetIndex, beforeTarget) {
    const {isProcessing, model} = this.dndService;
    if (!isProcessing) return;
    if (model.type !== this.type) return;

    if (targetIndex < 0) return;

    let originalIndex;
    let currentIndex;
    let nextIndex;
    if (this.intention) {
      originalIndex = this.intention.fromIndex;
      currentIndex = this.intention.toIndex;
    } else {
      originalIndex = model.index;
      if (originalIndex < 0) return;
      currentIndex = originalIndex;
    }

    if (currentIndex < targetIndex) {
      // grabbed item is currently above target
      if (beforeTarget) {
        nextIndex = targetIndex - 1;
      } else {
        nextIndex = targetIndex;
      }
    } else /* if (currentIndex > targetIndex) */ { // no need to check, currentIndex never === targetIndex
      // grabbed item is currently below target
      if (beforeTarget) {
        nextIndex = targetIndex;
      } else {
        nextIndex = targetIndex + 1;
      }
    }

    if (!this.intention ||
        this.intention.fromIndex !== originalIndex ||
        this.intention.toIndex !== nextIndex) {
      this.intention = {
        fromIndex: originalIndex,
        toIndex: nextIndex
      };
    }
  }

}
