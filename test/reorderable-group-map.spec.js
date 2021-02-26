import {ReorderableGroupMap} from '../src/reorderable-group-map';
import test from 'tape-promise/tape';

const numbers = [1, 2, 3];
const letters = ['a', 'b'];

test('ReorderableGroupMap: even holds non-group-repeater', async t => {
  const map = new ReorderableGroupMap();
  map.add({repeaterId: 'id', items: numbers});
  t.ok(map.get(numbers));
});

test('ReorderableGroupMap: set and remove group repeater', async t => {
  const map = new ReorderableGroupMap();
  const r1 = {type: 'group', repeaterId: 'id', items: numbers};
  const r2 = {type: 'group', repeaterId: 'id2', items: letters};
  map.add(r1);
  map.add(r2);
  let g1 = map.get(numbers);
  let g2 = map.get(letters);
  t.equal(g1.group(), 'group');
  t.equal(g1.repeaterId, 'id');
  t.equal(g2.group(), 'group');
  t.equal(g2.repeaterId, 'id2');

  map.remove(r1);
  r2.type = 'new-group';
  t.notOk(map.get(numbers));
  g2 = map.get(letters);
  t.equal(g2.group(), 'new-group');
  t.equal(g2.repeaterId, 'id2');

  map.remove(r2);
  t.notOk(map.get(numbers));
  t.notOk(map.get(letters));
});
