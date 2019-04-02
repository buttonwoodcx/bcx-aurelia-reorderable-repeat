import {inject} from 'aurelia-dependency-injection';
import {customAttribute} from 'aurelia-templating';
import {DndService} from 'bcx-aurelia-dnd';
import {EventAggregator} from 'aurelia-event-aggregator';
// import {TaskQueue} from 'aurelia-task-queue';
import {ReorderableGroupMap} from './reorderable-group-map';

const example = 'reorderable-group-for.bind="arrayModel"';

@customAttribute('reorderable-group-for')
@inject(Element, EventAggregator, DndService, ReorderableGroupMap)
export class ReorderableGroupFor {
  intention = null;

  constructor(element, ea, dndService, groupMap) {
    this.element = element;
    this.ea = ea;
    this.dndService = dndService;
    this.groupMap = groupMap;
    this.resetIntention = this.resetIntention.bind(this);
  }

  bind() {
    const {value} = this;
    if (!Array.isArray(value)) {
      throw new Error('reorderable-group-for needs items to be an array. e.g. ' + example);
    }

    this._subsribers = [
      this.ea.subscribe('dnd:willStart', () => {
        if (!this.repeaterId) {
          const repeaterInfo = this.groupMap.get(value);
          if (repeaterInfo) {
            this.group = repeaterInfo.group;
            this.repeaterId = repeaterInfo.repeaterId;
          } else {
            this.group = null;
            this.repeaterId = null;
          }
        }

        this.resetIntention();
      }),
      this.ea.subscribe('dnd:didEnd', this.resetIntention),
      this.ea.subscribe('reorderable-group:intention-changed', intention => {
        if (intention.type !== this.group) return;
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
    return model.type === this.group;
  }

  dndHover() {
    if (!this.repeaterId) return;

    const {isHoveringShallowly, model} = this.dnd;
    if (!isHoveringShallowly) return;

    const {type, index, item, repeaterId} = model;
    const length = this.value ? this.value.length : 0;
    const inSameGroup = model.repeaterId === this.repeaterId;
    const defaultTargetIndex = inSameGroup ? length - 1 : length;

    if (!this.intention || this.intention.toRepeaterId !== this.repeaterId) {
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
