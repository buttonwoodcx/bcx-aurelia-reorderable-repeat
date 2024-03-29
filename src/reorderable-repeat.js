/*eslint no-loop-func:0, no-unused-vars:0*/
import {inject} from 'aurelia-dependency-injection';
import {
  ObserverLocator,
  observable,
  BindingEngine,
  BindingBehavior,
  ValueConverter,
  getContextFor
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
  isOneTime,
  updateOneTimeBinding,
  viewsRequireLifecycle,
  AbstractRepeater
} from 'aurelia-templating-resources';
import {ReorderableRepeatStrategyLocator} from './reorderable-repeat-strategy-locator';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TaskQueue} from 'aurelia-task-queue';
import repeaterDndType from './repeater-dnd-type';
import {ReorderableGroupMap} from './reorderable-group-map';

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
* Binding to iterate over Array to genereate a template for each iteration.
*/
@customAttribute('reorderable-repeat')
@templateController
@inject(EventAggregator, TaskQueue, BindingEngine, DndService, BoundViewFactory, TargetInstruction, ViewSlot, ViewResources, ObserverLocator, ReorderableRepeatStrategyLocator, ReorderableGroupMap)
export class ReorderableRepeat extends AbstractRepeater {
  /**
  * List of items to bind the repeater to.
  *
  * @property items
  */
  @bindable items;
  /**
  * Local variable which gets assigned on each iteration.
  *
  * @property local
  */
  @bindable local;

  @observable intention = null;
  @observable patchedItems;
  @observable type = null;

  /**
 * Creates an instance of Repeat.
 * @param viewFactory The factory generating the view
 * @param instruction The instructions for how the element should be enhanced.
 * @param viewResources Collection of resources used to compile the the views.
 * @param viewSlot The slot the view is injected in to.
 * @param observerLocator The observer locator instance.
 * @param collectionStrategyLocator The strategy locator to locate best strategy to iterate the collection.
 */
  constructor(ea, taskQueue, bindingEngine, dndService, viewFactory, instruction, viewSlot, viewResources, observerLocator, strategyLocator, groupMap) {
    super({
      local: 'item',
      viewsRequireLifecycle: viewsRequireLifecycle(viewFactory)
    });

    this.repeaterId = seed;
    this.type = this.repeaterId;
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
    this.groupMap = groupMap;

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

    this.group = this._reorderableGroup();
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
      this.ea.subscribe('dnd:didCancel', () => {
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
        const {item, fromIndex, fromRepeaterId, toIndex, toRepeaterId} = this.intention;
        this.intention = null;

        const repeaterId = repeaterDndType(this.repeaterId);
        if (repeaterId !== fromRepeaterId && repeaterId !== toRepeaterId) return;

        // no change
        if (fromRepeaterId === toRepeaterId && fromIndex === toIndex) return;

        const change = {item, fromIndex, toIndex};

        if (repeaterId === fromRepeaterId) {
          this.items.splice(fromIndex, 1);
          change.removedFromThisList = true;
        }

        if (repeaterId === toRepeaterId) {
          this.items.splice(toIndex, 0, item);
          change.insertedToThisList = true;
        }

        const afterReordering = this._reorderableAfterReorderingFunc();
        if (afterReordering) {
          // in group mode, wait for all models updated
          // before hitting callback
          this.taskQueue.queueMicroTask(() => {
            afterReordering(this.items, change);
          });
        }
      }),
      this.ea.subscribe('reorderable-group:intention-changed', intention => {
        if (intention.type !== repeaterDndType(this.type)) return;

        // avoid double trigger of intentionChanged;
        if (this.intention &&
            intention.type === this.intention.type &&
            intention.fromIndex === this.intention.fromIndex &&
            intention.fromRepeaterId === this.intention.fromRepeaterId &&
            intention.toIndex === this.intention.toIndex &&
            intention.toRepeaterId === this.intention.toRepeaterId) return;

        // sync intention from other repeater
        this.intention = intention;
      })
    ];
    if (typeof this.group === 'string') {
      this.type = this.group;
    } else if (this.group) {
      // group is a binding expression or interpolation binding expression.
      this.group.targetProperty = 'type',
      this._typeBinding = this.group.createBinding(this);
      this._typeBinding.bind(this.scope);
    }
    this.patchedItems = [...this.items];
    this.patchedItemsChanged();
  }

  /**
  * Unbinds the repeat
  */
  unbind() {
    this.groupMap.remove(this);
    if (this._typeBinding) {
      this._typeBinding.unbind();
      delete this._typeBinding;
    }

    if (this.arrayObserver) {
      this.arrayObserver.dispose();
      this.arrayObserver = null;
    }
    this._subsribers.forEach(s => s.dispose());
    this._subsribers = [];

    this.removeAllViews(true, true);
    this.scope = null;
    this.items = null;
    this.matcherBinding = null;
  }

  intentionChanged(newIntention) {
    if (newIntention) {
      const repeaterId = repeaterDndType(this.repeaterId);

      const {item, fromIndex, fromRepeaterId, toIndex, toRepeaterId} = newIntention;

      let patched = [...this.items];

      if (repeaterId === fromRepeaterId) {
        patched.splice(fromIndex, 1);
      }

      if (repeaterId === toRepeaterId) {
        patched.splice(toIndex, 0, item);
      }

      this.patchedItems = patched;
    } else {
      if (this.items) {
        this.patchedItems = [...this.items];
      } else {
        this.patchedItems = null;
      }
    }
  }

  // every time the items property changes.
  itemsChanged() {
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

  // every time the items array add/delete.
  _itemsMutated() {
    if (this.intention === null) {
      this.patchedItems = [...this.items];
    } else {
      this.intention = null;
    }
  }

  patchedItemsChanged() {
    this._reload();
  }

  typeChanged() {
    this._reload();
  }

  _reload() {
    // still bound?
    if (!this.scope) {
      return;
    }

    if (!this.patchedItems) {
      return;
    }

    this.strategy = this.strategyLocator.getStrategy(this.patchedItems);
    if (!this.strategy) {
      throw new Error(`Value for '${this.sourceExpression}' is non-repeatable`);
    }

    this.strategy.instanceChanged(this, this.patchedItems);
    this.taskQueue.queueMicroTask(() => {
      // avoid this async task after unbind
      if (!this.scope) {
        return;
      }

      this.groupMap.remove(this);
      this.views().forEach(view => {
        this._unRegisterDnd(view);
        this._registerDnd(view);
      });
      this.groupMap.add(this);
    });
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
    view.bind(bindingContext, overrideContext);
    this.viewSlot.add(view);
  }

  insertView(index, bindingContext, overrideContext) {
    let view = this.viewFactory.create();
    view.bind(bindingContext, overrideContext);
    this.viewSlot.insert(index, view);
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
  }

  _additionalAttribute(view, attribute) {
    if (view && view.firstChild && view.firstChild.au && view.firstChild.au[attribute]) {
      return view.firstChild.au[attribute].instruction.attributes[attribute];
    }
    // Fall back to plain string attribute
    return this._getPlainAttribute(attribute);
  }

  _getPlainAttribute(name) {
    // only get the string value before view rendering
    if (this.viewFactory && this.viewFactory.viewFactory) {
      const node = this.viewFactory.viewFactory.template.firstChild;
      if (node && node.hasAttribute(name)) {
        return node.getAttribute(name);
      }
    }
  }

  _reorderableGroup() {
    if (this.viewFactory && this.viewFactory.viewFactory) {
      const node = this.viewFactory.viewFactory.template.firstChild;
      const targetId = node.getAttribute('au-target-id');
      const instruction = this.viewFactory.viewFactory.instructions[targetId];
      if (instruction) {
        const bi = instruction.behaviorInstructions.find(bi => bi.attrName === 'reorderable-group');
        if (bi) {
          const exp = bi.attributes && bi.attributes['reorderable-group'];
          if (exp && typeof exp.createBinding === 'function') {
            // binding expression or interpolation binding expression.
            return exp;
          }
        }
      }
    }

    return this._getPlainAttribute('reorderable-group');
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
      const context = getContextFor(func, this.scope);
      let funcCall = context[func];

      if (typeof funcCall === 'function') {
        return funcCall.bind(context);
      }
      throw new Error("'reorderable-dnd-preview' must be a function or evaluate to a function");
    } else if (func.sourceExpression) {
      // TODO test preview
      return (_, scope) => {
        return func.sourceExpression.evaluate(scope);
      };
    } else {
      throw new Error("'reorderable-dnd-preview' must be a function or evaluate to a function");
    }
  }

  _reorderableAfterReorderingFunc() {
    const func = this._additionalAttribute(this.view(0), 'reorderable-after-reordering');

    if (!func) {
      return null;
    } else if (typeof func === 'string') {
      const context = getContextFor(func, this.scope);
      let funcCall = context[func];

      if (typeof funcCall === 'function') {
        return funcCall.bind(context);
      }
      throw new Error("'reorderable-after-reordering' must be a function or evaluate to a function");
    } else if (func.sourceExpression) {
      return () => func.sourceExpression.evaluate(this.scope);
    } else {
      throw new Error("'reorderable-after-reordering' must be a function or evaluate to a function");
    }
  }

  _dndHover(location, index, direction) {
    const repeaterId = repeaterDndType(this.repeaterId);
    // bypass hovering on itself
    if (this.intention &&
        this.intention.toRepeaterId === repeaterId &&
        this.intention.toIndex === index) {
      return;
    }

    const {model} = this.dndService;

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
    if (inLeastHalf ||
        // or starting on itself
        (!this.intention && model.repeaterId === repeaterId && index === model.index)) {
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
      handler = el.querySelector(handlerSelector);
    }

    const repeaterId = repeaterDndType(this.repeaterId);

    const direction = this._reorderableDirection(view);
    const _previewFunc = this._dndPreviewFunc(view);

    this.dndService.addSource({
      dndModel: () => ({type: repeaterDndType(this.type), index, item, repeaterId}),
      dndPreview: _previewFunc && (() => _previewFunc(item, view)),
      dndElement: el
    }, handler && {handler});

    this.dndService.addTarget({
      dndElement: el,
      dndCanDrop: (model) => {
        if (model.type !== repeaterDndType(this.type)) return false;

        const {intention} = this;
        const inSameGroup = model.repeaterId === repeaterId;

        this.taskQueue.queueMicroTask(() => {
          classes.add(el, 'reorderable-repeat-reordering');
        });

        let draggingMe;

        if (intention) {
          draggingMe = intention.toRepeaterId === repeaterId &&
                       intention.toIndex === index;
        } else if (inSameGroup) {
          draggingMe = model.index === index;
        }

        if (draggingMe) {
          // I am under dragging
          this.taskQueue.queueMicroTask(() => {
            classes.add(el, 'reorderable-repeat-dragging-me');
          });
        }

        return true;
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
    if (model.type !== repeaterDndType(this.type)) return;

    const repeaterId = repeaterDndType(this.repeaterId);
    const isUsingGroup = model.type !== model.repeaterId;
    const inSameGroup = model.repeaterId === repeaterId;

    if (targetIndex < 0) return;

    let originalIndex;
    let currentIndex;
    let nextIndex;

    if (inSameGroup) {
      if (this.intention) {
        originalIndex = this.intention.fromIndex;
        currentIndex = this.intention.toIndex;
      } else {
        originalIndex = model.index;
        if (originalIndex < 0) return;
        currentIndex = originalIndex;
      }
    } else {
      if (this.intention && this.intention.toRepeaterId === repeaterId) {
        originalIndex = this.intention.fromIndex;
        currentIndex = this.intention.toIndex;
      } else {
        originalIndex = model.index;
        if (originalIndex < 0) return;
        currentIndex = targetIndex;
      }
    }

    if (currentIndex < targetIndex) {
      // grabbed item is currently above target
      if (beforeTarget) {
        nextIndex = targetIndex - 1;
      } else {
        nextIndex = targetIndex;
      }
    } else /* if (currentIndex > targetIndex) or across repeaters */ {
      // grabbed item is currently below target
      if (beforeTarget) {
        nextIndex = targetIndex;
      } else {
        nextIndex = targetIndex + 1;
      }
    }

    if (!this.intention ||
        this.intention.fromIndex !== originalIndex ||
        this.intention.fromRepeaterId !== model.repeaterId ||
        this.intention.toIndex !== nextIndex ||
        this.intention.toRepeaterId !== repeaterId) {
      this.intention = {
        type: model.type,
        item: model.item,
        fromIndex: originalIndex,
        fromRepeaterId: model.repeaterId,
        toIndex: nextIndex,
        toRepeaterId: repeaterId
      };

      if (isUsingGroup) {
        // let other repeaters know
        this.ea.publish('reorderable-group:intention-changed', this.intention);
      }
    }
  }
}
