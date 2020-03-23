import {ReorderableGroupMap} from '../src/reorderable-group-map';

describe('ReorderableGroupMap', () => {
  let map;
  let numbers = [1, 2, 3];
  let letters = ['a', 'b'];

  beforeEach(() => {
    map = new ReorderableGroupMap();
  });

  it('ignores non-group-repeater', () => {
    map.add({type: 'id', repeaterId: 'id', items: numbers});
    expect(map.get(numbers)).toBeUndefined();
  });

  it('set and remove group repeater', () => {
    let r1 = {type: 'group', repeaterId: 'id', items: numbers};
    let r2 = {type: 'group', repeaterId: 'id2', items: letters};
    map.add(r1);
    map.add(r2);
    expect(map.get(numbers)).toEqual({group: 'group', repeaterId: 'id'});
    expect(map.get(letters)).toEqual({group: 'group', repeaterId: 'id2'});

    map.remove(r1);
    expect(map.get(numbers)).toBeUndefined();
    expect(map.get(letters)).toEqual({group: 'group', repeaterId: 'id2'});

    map.remove(r2);
    expect(map.get(numbers)).toBeUndefined();
    expect(map.get(letters)).toBeUndefined();
  });
});
