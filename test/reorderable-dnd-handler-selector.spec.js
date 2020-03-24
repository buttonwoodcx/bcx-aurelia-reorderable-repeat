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

test('reorderable-dnd-handler-selector: starts dnd inside handler', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat', 'reorderable-dnd-handler-selector'])
    .inView(`
      <div style="height: 50px; width: 100px; position: relative;"
        reorderable-repeat.for="obj of items"
        reorderable-dnd-handler-selector=".handler">
        <div class="handler" style="position: absolute; top: 0; left: 0; width: 20px; height: 20px;"></div>
        \${obj.name}
      </div>`)
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

  component.create(bootstrap);
  await delay();
  const reorderableRepeat = component.viewModel;
  const viewModel = component.viewModel;
  await delay();
  t.equal(reorderableRepeat.viewCount(), 3);
  t.notOk($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 40});
  // first small movement
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  // mousedown outside of handler does not trigger dnd
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  fireEvent($(reorderableRepeat.view(0).firstChild).find('.handler').get(0), 'mousedown', {which: 1, clientX: 20, clientY: 20});
  // first small movement
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  t.equal(reorderableRepeat.viewCount(), 3);
  t.ok($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(reorderableRepeat.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(reorderableRepeat.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(reorderableRepeat.view(2).bindingContext.obj, {name: 'three'});
  t.ok(reorderableRepeat.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to upper half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
  await delay();
  // no change yet.
  t.equal(reorderableRepeat.viewCount(), 3);
  t.ok($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(reorderableRepeat.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(reorderableRepeat.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(reorderableRepeat.view(2).bindingContext.obj, {name: 'three'});
  t.ok(reorderableRepeat.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 2nd element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
  await delay();
  // swapped.
  t.equal(reorderableRepeat.viewCount(), 3);
  t.notOk($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(reorderableRepeat.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(reorderableRepeat.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(reorderableRepeat.view(2).bindingContext.obj, {name: 'three'});
  t.ok(reorderableRepeat.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
  await delay();
  // no change yet.
  t.equal(reorderableRepeat.viewCount(), 3);
  t.notOk($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(reorderableRepeat.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(reorderableRepeat.view(1).bindingContext.obj, {name: 'one'});
  t.deepEqual(reorderableRepeat.view(2).bindingContext.obj, {name: 'three'});
  t.ok(reorderableRepeat.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to top half of 1st reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
  await delay();
  // reorder again.
  t.equal(reorderableRepeat.viewCount(), 3);
  t.ok($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(reorderableRepeat.view(0).bindingContext.obj, {name: 'one'});
  t.deepEqual(reorderableRepeat.view(1).bindingContext.obj, {name: 'two'});
  t.deepEqual(reorderableRepeat.view(2).bindingContext.obj, {name: 'three'});
  t.ok(reorderableRepeat.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // move to bottom half of 3rd reordered element
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder again.
  t.equal(reorderableRepeat.viewCount(), 3);
  t.notOk($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.ok($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(reorderableRepeat.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(reorderableRepeat.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(reorderableRepeat.view(2).bindingContext.obj, {name: 'one'});
  t.ok(reorderableRepeat.dndService.isProcessing);
  t.deepEqual(viewModel.items, [{name: 'one'}, {name: 'two'}, {name: 'three'}]);
  await delay();
  // drop it
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 126});
  await delay();
  // reorder viewmodel.
  t.deepEqual(viewModel.items, [{name: 'two'}, {name: 'three'}, {name: 'one'}]);
  t.equal(reorderableRepeat.viewCount(), 3);
  t.notOk($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.deepEqual(reorderableRepeat.view(0).bindingContext.obj, {name: 'two'});
  t.deepEqual(reorderableRepeat.view(1).bindingContext.obj, {name: 'three'});
  t.deepEqual(reorderableRepeat.view(2).bindingContext.obj, {name: 'one'});
  t.notOk(reorderableRepeat.dndService.isProcessing);
});
