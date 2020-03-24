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

test('reorderable-direction: flow to right', async t=> {
  component = StageComponent
    .withResources(['reorderable-repeat', 'reorderable-direction'])
    .inView(`
      <div style="height: 50px; width: 50px; float: left;"
        reorderable-repeat.for="obj of items"
        reorderable-direction="right">
        \${obj.name}
      </div>`)
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

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
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to left half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 74, clientY: 20});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to right half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 76, clientY: 20});
  await delay();
  // swapped.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to right half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 26, clientY: 20});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to left half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 24, clientY: 20});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to right half of 3rd reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 126, clientY: 20});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // drop it
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 126, clientY: 20});
  await delay();
  // reorder viewmodel.
  t.deepEqual(viewModel.items, [{name: 'two'}, {name: 'three'}, {name: 'one'}]);
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.notOk(viewModel.dndService.isProcessing);
});

test('reorderable-direction: flow to left', async t=> {
  component = StageComponent
    .withResources(['reorderable-repeat', 'reorderable-direction'])
    .inView(`
      <div style="height: 100px; width: 200px;">
        <div style="height: 50px; width: 50px; float: right;"
          reorderable-repeat.for="obj of items"
          reorderable-direction="left">
          \${obj.name}
        </div>
      </div>`)
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

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
  fireEvent(viewModel.view(0).firstChild, 'mousedown', {which: 1, clientX: 180, clientY: 20});
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 180, clientY: 21});
  await delay();
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to right half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 126, clientY: 20});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to left half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 124, clientY: 20});
  await delay();
  // swapped.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to left half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 174, clientY: 20});
  await delay();
  // no change yet.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to right half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 176, clientY: 20});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.ok($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'three'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to left half of 3rd reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 74, clientY: 20});
  await delay();
  // reorder again.
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // drop it
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 74, clientY: 20});
  await delay();
  // reorder viewmodel.
  t.deepEqual(viewModel.items, [{name: 'two'}, {name: 'three'}, {name: 'one'}]);
  t.equal(viewModel.viewCount(), 3);
  t.notOk($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(viewModel.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(viewModel.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(viewModel.view(2).bindingContext.obj, {name: 'one'});
  t.notOk(viewModel.dndService.isProcessing);
});
