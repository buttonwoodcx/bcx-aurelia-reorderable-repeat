
export class ReorderableGroupMap {
  groups = {};

  add(repeater) {
    const {groups} = this;
    const {type, repeaterId, items} = repeater;
    if (type === repeaterId) return;

    if (!groups[type]) {
      groups[type] = new WeakMap();
    }

    groups[type].set(items, repeaterId);
  }

  remove(repeater) {
    const {groups} = this;
    const {type, repeaterId, items} = repeater;
    if (type === repeaterId) return;

    if (groups[type]) {
      groups[type].delete(items);
    }
  }

  getRepeaterId(group, items) {
    const {groups} = this;
    return groups[group] && groups[group].get(items);
  }
}
