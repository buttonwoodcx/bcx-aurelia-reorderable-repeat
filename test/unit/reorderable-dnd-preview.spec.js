import {createAssertionQueue, fireEvent} from './utils';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import $ from 'jquery';

const nq = createAssertionQueue();
const doc = document;
const documentElement = doc.documentElement;
describe('reorderable-dnd-preview:', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.dispose();
      component = null;
    }
  });

  it('without preview', done => {
    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-dnd-preview'])
      .inView(`
        <div style="height: 50px; width: 100px;"
          reorderable-repeat.for="obj of items">
          \${obj.name}
        </div>`)
      .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

    component.create(bootstrap).then(() => {
      const reorderableRepeat = component.viewModel;

      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect($('.bcx-dnd-preview').text().trim()).toEqual('one');
      });
      nq(() => {
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 21});
      });
      nq(done);
    });
  });

  it('preview with string ref', done => {
    function itemPreview(item) {
      return $(`<div>#${item.name}</div>`).get(0);
    }
    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-dnd-preview'])
      .inView(`
        <div style="height: 50px; width: 100px;"
          reorderable-repeat.for="obj of items"
          reorderable-dnd-preview="itemPreview">
          \${obj.name}
        </div>`)
      .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}], itemPreview});

    component.create(bootstrap).then(() => {
      const reorderableRepeat = component.viewModel;

      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect($('.bcx-dnd-preview').text().trim()).toEqual('#one');
      });
      nq(() => {
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 21});
      });
      nq(done);
    });
  });

  it('preview with call binding', done => {
    function itemPreview(prefix, item) {
      return $(`<div>${prefix}${item.name}</div>`).get(0);
    }
    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-dnd-preview'])
      .inView(`
        <div style="height: 50px; width: 100px;"
          reorderable-repeat.for="obj of items"
          reorderable-dnd-preview.call="itemPreview('*', obj)">
          \${obj.name}
        </div>`)
      .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}], itemPreview});

    component.create(bootstrap).then(() => {
      const reorderableRepeat = component.viewModel;

      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect($('.bcx-dnd-preview').text().trim()).toEqual('*one');
      });
      nq(() => {
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 21});
      });
      nq(done);
    });
  });
});
