import {delay, fireEvent} from './utils';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {Container} from 'aurelia-dependency-injection';
import {DndService} from 'bcx-aurelia-dnd';
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

test('reorderable-repeat: objects render empty list', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat', '../dev-app/box'])
    .inView('<box style="height: 50px; width: 100px;" reorderable-repeat.for="obj of items">${obj.name}</box>')
    .boundTo({items: []});

  component.create(bootstrap);
  await delay();
  const viewModel = component.viewModel;
  await delay();
  t.equal(viewModel.viewCount(), 0);
  await delay();
  viewModel.items.push({name: 'lorem'});
  await delay();
  t.equal(viewModel.viewCount(), 1);
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'lorem'});
});

test('reorderable-repeat: objects render list', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat', '../dev-app/box'])
    .inView('<box style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">${obj.name}</box>')
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

  component.create(bootstrap);
  await delay();
    const viewModel = component.viewModel;

  await delay();
  t.equal(viewModel.viewCount(), 3);
  await delay();
  viewModel.items.splice(1, 1);
  await delay();
  t.equal(viewModel.viewCount(), 2);
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
});

test('reorderable-repeat: objects re-render list should not cause memory leak', async t => {
  const model = {items: [{name: 'one'}, {name: 'two'}, {name: 'three'}], show: true};
  component = StageComponent
    .withResources(['reorderable-repeat', '../dev-app/box'])
    .inView('<div if.bind="show"><box style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">${obj.name}</box></div>')
    .boundTo(model);

  component.create(bootstrap);
  await delay();
  const dndService = Container.instance.get(DndService);
  t.equal(dndService.dndSources.length, 3);
  t.equal(dndService.dndTargets.length, 3);

  await delay();
  model.show = false;
  await delay();
  t.equal(dndService.dndSources.length, 0);
  t.equal(dndService.dndTargets.length, 0);
  await delay();
  model.show = true;
  await delay();
  t.equal(dndService.dndSources.length, 3);
  t.equal(dndService.dndTargets.length, 3);
});

test('reorderable-repeat: objects reorders', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat', '../dev-app/box'])
    .inView('<box style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">${obj.name}</box>')
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

  component.create(bootstrap);
  await delay();
    const viewModel = component.viewModel;

  await delay();
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
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
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to upper half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // swapped.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to top half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 3rd reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // drop it
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder viewmodel.
  t.deepEqual(viewModel.items, [{name: 'two'}, {name: 'three'}, {name: 'one'}]);
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.notOk(viewModel.dndService.isProcessing);
});

test('reorderable-repeat: objects reorders after array replacement', async t => {
  let model = {items: []};
  component = StageComponent
    .withResources(['reorderable-repeat', '../dev-app/box'])
    .inView('<box style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">${obj.name}</box>')
    .boundTo(model);

  component.create(bootstrap);
  await delay();
  const viewModel = component.viewModel;
  await delay();
  // replace array
  model.items = [{name: 'one'}, {name: 'two'}];
  await delay();
  // delay mutation after replacement
  model.items.push({name: 'three'});
  await delay();
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
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
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to upper half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // swapped.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to top half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 3rd reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // drop it
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder viewmodel.
  t.deepEqual(viewModel.items, [{name: 'two'}, {name: 'three'}, {name: 'one'}]);
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.notOk(viewModel.dndService.isProcessing);
});

test('reorders duplicated strings', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat', '../dev-app/box'])
    .inView('<box style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">${obj.name}</box>')
    .boundTo({items: [{name: 'one'}, {name: 'one'}, {name: 'three'}]});

  component.create(bootstrap);
  await delay();
    const viewModel = component.viewModel;

  await delay();
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
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
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'one'}, {name: 'three'}]);
  await delay();
  // move to upper half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'one'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // swapped 1st 'one' with 2nd 'one'.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'one'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'one'}, {name: 'three'}]);
  await delay();
  // move to top half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'one'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 3rd reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'one'}, {name: 'three'}]);
  await delay();
  // drop mouse outside still trigger reordering
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 150, clientY: 126});
  await delay();
  // reorder viewmodel.
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'three'}, {name: 'one'}]);
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-reordering'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-reordering'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.notOk(viewModel.dndService.isProcessing);
});

