export class ReorderableGroupMap {
  _map = new WeakMap();

  add(repeater) {
    const {repeaterId, items} = repeater;
    if(items) {
      this._map.set(items, {group: () => repeater.type, repeaterId});
    }
  }

  remove(repeater) {
    const {items} = repeater;
    this._map.delete(items);
  }

  get(items) {
    return this._map.get(items);
  }
}
