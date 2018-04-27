import {ReorderableGroupMap} from '../../src/resources/reorderable-group-map';

describe('ReorderableGroupMap', () => {
  let map;
  let numbers = [1,2,3];
  let letters = ['a', 'b'];

  beforeEach(() => {
    map = new ReorderableGroupMap();
  });

  it('ignores non-group-repeater', () => {
    map.add({type: 'id', repeaterId: 'id', items: numbers});
    expect(map.getRepeaterId('id', numbers)).toBeUndefined();
  });

  it('set and remove group repeater', () => {
    let r1 = {type: 'group', repeaterId: 'id', items: numbers};
    let r2 = {type: 'group', repeaterId: 'id2', items: letters};
    map.add(r1);
    map.add(r2);
    expect(map.getRepeaterId('group', numbers)).toBe('id');
    expect(map.getRepeaterId('group', letters)).toBe('id2');

    map.remove(r1);
    expect(map.getRepeaterId('group', numbers)).toBeUndefined();
    expect(map.getRepeaterId('group', letters)).toBe('id2');

    map.remove(r2);
    expect(map.getRepeaterId('group', numbers)).toBeUndefined();
    expect(map.getRepeaterId('group', letters)).toBeUndefined();
  });
});
