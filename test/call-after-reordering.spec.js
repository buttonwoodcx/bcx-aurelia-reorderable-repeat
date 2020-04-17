import {delay, fireEvent} from './utils';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {default as _test} from 'tape-promise/tape';

const doc = document;
const documentElement = doc.documentElement;

let component;

function test(title, cb) {
  return _test(title, async t => {
    let err;
    try {
      await cb(t);
    } catch (e) {
      err = e;
    }

    if (component) {
      component.dispose();
      component = null;
    }

    if (err) throw err;
  });
}

test('reorderable-repeat: primitive array call after reordering with string', async t => {
  let seenItems;
  let change;
  function action(items, c) {
    seenItems = items;
    change = c;
  }

  component = StageComponent
    .withResources(['../src/reorderable-repeat', '../src/reorderable-after-reordering'])
    .inView(`
      <div style="height: 50px; width: 100px;"
        reorderable-repeat.for="obj of items"
        reorderable-after-reordering="action">
        \${obj}
      </div>`)
    .boundTo({items: [1, 2, 3], action});

  await component.create(bootstrap);
  const reorderableRepeat = component.viewModel;

  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // drop on bottom half of 2nd element
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
  await delay();
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  t.deepEqual(seenItems, [2, 1, 3]);
  t.deepEqual(change, {item: 1, fromIndex: 0, toIndex: 1, removedFromThisList: true, insertedToThisList: true});
});

test('reorderable-repeat: primitive array call after reordering with call binding', async t => {
  let seenItems;
  function action(items) {
    seenItems = items;
  }

  component = StageComponent
    .withResources(['../src/reorderable-repeat', '../src/reorderable-after-reordering'])
    .inView(`
      <div style="height: 50px; width: 100px;"
        reorderable-repeat.for="obj of items"
        reorderable-after-reordering.call="action(items)">
        \${obj.name}
      </div>`)
    .boundTo({items: [1, 2, 3], action});

  await component.create(bootstrap);
  const reorderableRepeat = component.viewModel;

  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // drop on bottom half of 2nd element
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
  await delay();
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  t.deepEqual(seenItems, [2, 1, 3]);
});

test('reorderable-repeat: objects call after reordering with string', async t => {
  let seenItems;
  let change;
  function action(items, c) {
    seenItems = items;
    change = c;
  }

  component = StageComponent
    .withResources(['../src/reorderable-repeat', '../src/reorderable-after-reordering'])
    .inView(`
      <div style="height: 50px; width: 100px;"
        reorderable-repeat.for="obj of items"
        reorderable-after-reordering="action">
        \${obj.name}
      </div>`)
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}], action});

  await component.create(bootstrap);
  const reorderableRepeat = component.viewModel;

  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // drop on bottom half of 2nd element
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
  await delay();
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  t.deepEqual(seenItems, [{name: 'two'}, {name: 'one'}, {name: 'three'}]);
  t.deepEqual(change, {item: {name: 'one'}, fromIndex: 0, toIndex: 1, removedFromThisList: true, insertedToThisList: true});
});

test('reorderable-repeat: objects call after reordering with call binding', async t => {
  let seenItems;
  function action(items) {
    seenItems = items;
  }

  component = StageComponent
    .withResources(['../src/reorderable-repeat', '../src/reorderable-after-reordering'])
    .inView(`
      <div style="height: 50px; width: 100px;"
        reorderable-repeat.for="obj of items"
        reorderable-after-reordering.call="action(items)">
        \${obj.name}
      </div>`)
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}], action});

  await component.create(bootstrap);
  const reorderableRepeat = component.viewModel;

  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // drop on bottom half of 2nd element
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
  await delay();
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  t.deepEqual(seenItems, [{name: 'two'}, {name: 'one'}, {name: 'three'}]);
});

test('reorderable-repeat: with multiple lists call after reordering with string', async t => {
  const numbers = [{value: 1}, {value: 2}, {value: 3}];
  const letters = [{value: 'a'}, {value: 'b'}];

  let seenItems1;
  let change1;
  function action1(items, c) {
    seenItems1 = items;
    change1 = c;
  }

  let seenItems2;
  let change2;
  function action2(items, c) {
    seenItems2 = items;
    change2 = c;
  }

  component = StageComponent
    .withResources(['../src/reorderable-repeat', '../src/reorderable-after-reordering', '../src/reorderable-group', '../src/reorderable-group-for'])
    .inView(`
        <div id="numbers" style="width: 50px; display: inline-block; vertical-align: top; padding-top: 50px;"
             reorderable-group-for.bind="numbers">
          <div style="height: 50px; width: 50px;" reorderable-repeat.for="o of numbers" reorderable-group="g" reorderable-after-reordering="action1">$\{o.value}</div>
        </div>
        <div id="letters" style="width: 50px; display: inline-block; vertical-align: top; padding-top: 50px;"
             reorderable-group-for.bind="letters">
          <div style="height: 50px; width: 50px;" reorderable-repeat.for="o of letters" reorderable-group="g" reorderable-after-reordering="action2">$\{o.value}</div>
        </div>
      `)
    .boundTo({numbers, letters, action1, action2});

  await component.create(bootstrap);
  const reorderableRepeat = component.viewModel;

  await delay();
  const secondNumberDiv = doc.elementFromPoint(25, 125);
  fireEvent(secondNumberDiv, 'mousedown', {which: 1, clientX: 24, clientY: 125});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 25, clientY: 125});
  await delay();
  // move to bottom half of 2nd element in letters
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 140});
  await delay();
  // drop on bottom half of 2nd element in letters
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 75, clientY: 140});
  await delay();
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  t.deepEqual(seenItems1, [{value: 1}, {value: 3}]);
  t.deepEqual(seenItems2, [{value: 'a'}, {value: 'b'}, {value: 2}]);
  t.deepEqual(change1, {item: {value: 2}, fromIndex: 1, toIndex: 2, removedFromThisList: true});
  t.deepEqual(change2, {item: {value: 2}, fromIndex: 1, toIndex: 2, insertedToThisList: true});
});

test('reorderable-repeat: objects call after reordering with string, with nested binding context', async t => {
  let seenItems;
  let change;
  function action(items, c) {
    seenItems = items;
    change = c;
  }

  component = StageComponent
    .withResources(['../src/reorderable-repeat', '../src/reorderable-after-reordering'])
    .inView(`
      <div repeat.for="group of groups">
        <div style="height: 50px; width: 100px;"
          reorderable-repeat.for="obj of group.items"
          reorderable-after-reordering="action">
          \${obj.name}
        </div>
      </div>`)
    .boundTo({
      groups: [
        {items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]}
      ],
      action
    });

  await component.create(bootstrap);
  const reorderableRepeat = component.viewModel.view(0).controllers[0].viewModel;

  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // drop on bottom half of 2nd element
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
  await delay();
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  t.deepEqual(seenItems, [{name: 'two'}, {name: 'one'}, {name: 'three'}]);
  t.deepEqual(change, {item: {name: 'one'}, fromIndex: 0, toIndex: 1, removedFromThisList: true, insertedToThisList: true});
});

test('reorderable-repeat: objects call after reordering with call binding, with deep nested binding context', async t => {
  let seenItems;
  function action(items) {
    seenItems = items;
  }

  component = StageComponent
    .withResources(['../src/reorderable-repeat', '../src/reorderable-after-reordering'])
    .inView(`
      <div with.bind="inner">
        <div with.bind="group">
          <div style="height: 50px; width: 100px;"
            reorderable-repeat.for="obj of items"
            reorderable-after-reordering.call="action(items)">
            \${obj.name}
          </div>
        </div>
      </div>`)
    .boundTo({
      inner: {
        group: {
          items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]
        }
      },
      action
    });

  await component.create(bootstrap);
  const reorderableRepeat = component.viewModel.view.controllers[0].viewModel.view.controllers[0].viewModel;

  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // drop on bottom half of 2nd element
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
  await delay();
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  t.deepEqual(seenItems, [{name: 'two'}, {name: 'one'}, {name: 'three'}]);
});
