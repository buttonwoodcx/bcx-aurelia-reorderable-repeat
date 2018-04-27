import {inject} from 'aurelia-dependency-injection';
import {bindingMode} from 'aurelia-binding';
import {bindable, customAttribute} from 'aurelia-templating';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';
// import {TaskQueue} from 'aurelia-task-queue';
import repeaterDndType from './repeater-dnd-type';
import {ReorderableGroupMap} from './reorderable-group-map';

//Placeholder attribute to prohibit use of this attribute name in other places

const example = 'reorderable-group-for="items.bind: arrayModel; group: group_name"';

@customAttribute('reorderable-group-for')
@inject(Element, EventAggregator, DndService, ReorderableGroupMap)
export class ReorderableGroupFor {
  @bindable group;
  @bindable({defaultBindingMode: bindingMode.twoWay}) items;
  intention: null;

  constructor(element, ea, dndService, groupMap) {
    this.element = element;
    this.ea = ea;
    this.dndService = dndService;
    this.groupMap = groupMap;
    this.resetIntention = this.resetIntention.bind(this);
  }

  bind() {
    const {items, group} = this;
    if (!Array.isArray(items)) {
      throw new Error('reorderable-group-for needs items to be an array. e.g. ' + example);
    }

    if (typeof group !== 'string' || !group) {
      throw new Error('reorderable-group-for needs a group name. e.g. ' + example);
    }
    this.type = repeaterDndType(group);

    this._subsribers = [
      this.ea.subscribe('dnd:willStart', () => {
        if (!this.repeaterId) {
          this.repeaterId = this.groupMap.getRepeaterId(this.type, this.items);
        }

        this.resetIntention();
      }),
      this.ea.subscribe('dnd:didEnd', this.resetIntention),
      this.ea.subscribe('reorderable-group:intention-changed', intention => {
        if (intention.type !== this.type) return;
        // sync intention from other repeater
        this.intention = intention;
      })
    ];
  }
  unbind() {
    this._subsribers.forEach(s => s.dispose());
    this._subsribers = [];
  }


  resetIntention() {
    this.intention = null;
  }

  attached() {
    this.dndService.addTarget(this, {element: this.element});
  }

  detached() {
    this.dndService.removeTarget(this);
  }

  dndCanDrop(model) {
    return model.type === this.type;
  }

  dndHover() {
    if (!this.repeaterId) return;

    const {isHoveringShallowly, model} = this.dnd;
    if (!isHoveringShallowly) return;

    const {type, index, item, repeaterId} = model;
    const length = this.items ? this.items.length : 0;
    const inSameGroup = model.repeaterId === this.repeaterId;
    const defaultTargetIndex = inSameGroup ? length - 1 : length;

    if (this.intention && this.intention.toRepeaterId !== this.repeaterId) {
      this.ea.publish('reorderable-group:intention-changed', {
        type,
        item,
        fromIndex: index,
        fromRepeaterId: repeaterId,
        toIndex: defaultTargetIndex, // move to last position
        toRepeaterId: this.repeaterId
      });
    }
  }

  dndDrop() {
    /* no-op */
  }
}
