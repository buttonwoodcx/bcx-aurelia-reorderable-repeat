import {delay, fireEvent} from './utils';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import $ from 'jquery';
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

test('reorderable-repeat: primitive array render empty list', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat'])
    .inView('<div style="height: 50px; width: 100px;" reorderable-repeat.for="obj of items">${obj}</div>')
    .boundTo({items: []});

  component.create(bootstrap);
  await delay();
  const viewModel = component.viewModel;
  await delay();
  t.equal(viewModel.viewCount(), 0);
  await delay();
  viewModel.items.push('lorem');
  await delay();
  t.equal(viewModel.viewCount(), 1);
  t.equal(viewModel.view(0).bindingContext.obj, 'lorem');
});

test('reorderable-repeat: primitive array render list', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat'])
    .inView('<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">${obj}</div>')
    .boundTo({items: ['one', 'two', 'three']});

  component.create(bootstrap);
  await delay();
  const viewModel = component.viewModel;
  await delay();
  t.equal(viewModel.viewCount(), 3);
  await delay();
  viewModel.items.splice(1, 1);
  await delay();
  t.equal(viewModel.viewCount(), 2);
  t.equal(viewModel.view(0).bindingContext.obj, 'one');
  t.equal(viewModel.view(1).bindingContext.obj, 'three');
});

test('reorderable-repeat: primitive array reorders', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat'])
    .inView('<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">${obj}</div>')
    .boundTo({items: ['one', 'two', 'three']});

  component.create(bootstrap);
  await delay();
  const viewModel = component.viewModel;
  await delay();
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk(viewModel.dndService.isProcessing);
  await delay();
  fireEvent(viewModel.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'two');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'two', 'three']);
  await delay();
  // move to upper half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'two');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'two', 'three']);
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // swapped.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'two');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'two', 'three']);
  await delay();
  // move to bottom half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'two');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'two', 'three']);
  await delay();
  // move to top half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'two');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'two', 'three']);
  await delay();
  // move to bottom half of 3rd reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'two');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'three');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'one');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'two', 'three']);
  await delay();
  // drop it
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder viewmodel.
  t.deepEqual(viewModel.items, ['two', 'three', 'one']);
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'two');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'three');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'one');
  t.notOk(viewModel.dndService.isProcessing);
});

test('reorderable-repeat: primitive array reorders duplicated strings', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat'])
    .inView('<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">${obj}</div>')
    .boundTo({items: ['one', 'one', 'three']});

  component.create(bootstrap);
  await delay();
  const viewModel = component.viewModel;
  await delay();
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk(viewModel.dndService.isProcessing);
  await delay();
  fireEvent(viewModel.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'one', 'three']);
  await delay();
  // move to upper half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'one', 'three']);
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // swapped 1st 'one' with 2nd 'one'.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'one', 'three']);
  await delay();
  // move to bottom half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'one', 'three']);
  await delay();
  // move to top half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'three');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'one', 'three']);
  await delay();
  // move to bottom half of 3rd reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'three');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'one');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, ['one', 'one', 'three']);
  await delay();
  // drop mouse outside still trigger reordering
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 150, clientY: 126});
  await delay();
  // reorder viewmodel.
  t.deepEqual(viewModel.items, ['one', 'three', 'one']);
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, 'one');
  t.deepEqual(viewModel.view(1).bindingContext.obj, 'three');
  t.deepEqual(viewModel.view(2).bindingContext.obj, 'one');
  t.notOk(viewModel.dndService.isProcessing);
});

