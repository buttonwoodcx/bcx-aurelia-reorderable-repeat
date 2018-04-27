
export class ReorderableGroupMap {
  _map = new WeakMap();

  add(repeater) {
    const {type, repeaterId, items} = repeater;
    if (type === repeaterId) return;
    this._map.set(items, {group: type, repeaterId});
  }

  remove(repeater) {
    const {type, repeaterId, items} = repeater;
    if (type === repeaterId) return;
    this._map.delete(items);
  }

  get(items) {
    return this._map.get(items);
  }
}
