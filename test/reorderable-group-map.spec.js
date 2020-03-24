import {ReorderableGroupMap} from '../src/reorderable-group-map';
import test from 'tape-promise/tape';

const numbers = [1, 2, 3];
const letters = ['a', 'b'];

test('ReorderableGroupMap: ignores non-group-repeater', async t => {
  const map = new ReorderableGroupMap();
  map.add({type: 'id', repeaterId: 'id', items: numbers});
  t.notOk(map.get(numbers));
});

test('ReorderableGroupMap: set and remove group repeater', async t => {
  const map = new ReorderableGroupMap();
  const r1 = {type: 'group', repeaterId: 'id', items: numbers};
  const r2 = {type: 'group', repeaterId: 'id2', items: letters};
  map.add(r1);
  map.add(r2);
  t.deepEqual(map.get(numbers), {group: 'group', repeaterId: 'id'});
  t.deepEqual(map.get(letters), {group: 'group', repeaterId: 'id2'});

  map.remove(r1);
  t.notOk(map.get(numbers));
  t.deepEqual(map.get(letters), {group: 'group', repeaterId: 'id2'});

  map.remove(r2);
  t.notOk(map.get(numbers));
  t.notOk(map.get(letters));
});
