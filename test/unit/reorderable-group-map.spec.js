import {ReorderableGroupMap} from '../../src/resources/reorderable-group-map';

describe('ReorderableGroupMap', () => {
  let map;
  let numbers = [1,2,3];
  let letters = ['a', 'b'];

  beforeEach(() => {
    map = new ReorderableGroupMap();
  });

  it('ignores non-group-repeator', () => {
    map.add({type: 'id', repeatorId: 'id', items: numbers});
    expect(map.getRepeatorId('id', numbers)).toBeUndefined();
  });

  it('set and remove group repeator', () => {
    let r1 = {type: 'group', repeatorId: 'id', items: numbers};
    let r2 = {type: 'group', repeatorId: 'id2', items: letters};
    map.add(r1);
    map.add(r2);
    expect(map.getRepeatorId('group', numbers)).toBe('id');
    expect(map.getRepeatorId('group', letters)).toBe('id2');

    map.remove(r1);
    expect(map.getRepeatorId('group', numbers)).toBeUndefined();
    expect(map.getRepeatorId('group', letters)).toBe('id2');

    map.remove(r2);
    expect(map.getRepeatorId('group', numbers)).toBeUndefined();
    expect(map.getRepeatorId('group', letters)).toBeUndefined();
  });
});
