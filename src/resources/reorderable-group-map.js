
export class ReorderableGroupMap {
  groups = {};

  add(repeator) {
    const {groups} = this;
    const {type, repeatorId, items} = repeator;
    if (type === repeatorId) return;

    if (!groups[type]) {
      groups[type] = new WeakMap();
    }

    groups[type].set(items, repeatorId);
  }

  remove(repeator) {
    const {groups} = this;
    const {type, repeatorId, items} = repeator;
    if (type === repeatorId) return;

    if (groups[type]) {
      groups[type].delete(items);
    }
  }

  getRepeatorId(group, items) {
    const {groups} = this;
    return groups[group] && groups[group].get(items);
  }
}
