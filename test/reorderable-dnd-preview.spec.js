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

test('reorderable-dnd-preview: without preview', async t => {
  component = StageComponent
    .withResources(['reorderable-repeat', 'reorderable-dnd-preview'])
    .inView(`
      <div style="height: 50px; width: 100px;"
        reorderable-repeat.for="obj of items">
        \${obj.name}
      </div>`)
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

  component.create(bootstrap);
  await delay();
  const reorderableRepeat = component.viewModel;
  await delay();
  t.equal(reorderableRepeat.viewCount(), 3);
  t.notOk($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  // first small movement
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  t.ok(reorderableRepeat.dndService.isProcessing);
  t.equal($('.bcx-dnd-preview').text().trim(), 'one');
  await delay();
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 21});
});

test('reorderable-dnd-preview: preview with string ref', async t => {
  function itemPreview(item) {
    return $(`<div>#${item.name}</div>`).get(0);
  }
  component = StageComponent
    .withResources(['reorderable-repeat', 'reorderable-dnd-preview'])
    .inView(`
      <div style="height: 50px; width: 100px;"
        reorderable-repeat.for="obj of items"
        reorderable-dnd-preview="itemPreview">
        \${obj.name}
      </div>`)
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}], itemPreview});

  component.create(bootstrap);
  await delay();
  const reorderableRepeat = component.viewModel;
  await delay();
  t.equal(reorderableRepeat.viewCount(), 3);
  t.notOk($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  // first small movement
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  t.ok(reorderableRepeat.dndService.isProcessing);
  t.equal($('.bcx-dnd-preview').text().trim(), '#one');
  await delay();
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 21});
});

test('reorderable-dnd-preview: preview with call binding', async t => {
  function itemPreview(prefix, item) {
    return $(`<div>${prefix}${item.name}</div>`).get(0);
  }
  component = StageComponent
    .withResources(['reorderable-repeat', 'reorderable-dnd-preview'])
    .inView(`
      <div style="height: 50px; width: 100px;"
        reorderable-repeat.for="obj of items"
        reorderable-dnd-preview.call="itemPreview('*', obj)">
        \${obj.name}
      </div>`)
    .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}], itemPreview});

  component.create(bootstrap);
  await delay();
  const reorderableRepeat = component.viewModel;
  await delay();
  t.equal(reorderableRepeat.viewCount(), 3);
  t.notOk($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me'));
  t.notOk(reorderableRepeat.dndService.isProcessing);
  await delay();
  fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
  // first small movement
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
  await delay();
  t.ok(reorderableRepeat.dndService.isProcessing);
  t.equal($('.bcx-dnd-preview').text().trim(), '*one');
  await delay();
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 21});
});
