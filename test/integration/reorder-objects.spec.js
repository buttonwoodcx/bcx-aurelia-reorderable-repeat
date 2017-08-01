/* global describe, it, beforeEach, afterEach, expect, fail */
import {StageComponent, createAssertionQueue, fireEvent} from '../component-tester';
import $ from 'jquery';

const nq = createAssertionQueue();
const doc = document;
const documentElement = doc.documentElement;

describe('reorderable-repeat: objects', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.cleanUp();
      component = null;
    }
  });

  it('render empty list', done => {
    component = StageComponent
      .withResources(['src/reorderable-repeat'])
      .inView(`<div style="height: 50px; width: 100px;" reorderable-repeat.for="obj of items">\${obj.name}</div>`)
      .boundTo({items: []});

    component.create().then(() => {
      const reorderableRepeat = component.sut;
      const viewModel = component.viewModel;

      nq(() => expect(reorderableRepeat.viewCount()).toEqual(0));
      nq(() => viewModel.items.push({name: 'lorem'}));
      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(1);
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'lorem'});
      });
      nq(done);
    });
  });

  it('render list', done => {
    component = StageComponent
      .withResources(['src/reorderable-repeat'])
      .inView(`<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">\${obj.name}</div>`)
      .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

    component.create().then(() => {
      const reorderableRepeat = component.sut;
      const viewModel = component.viewModel;

      nq(() => expect(reorderableRepeat.viewCount()).toEqual(3));
      nq(() => viewModel.items.splice(1,1));
      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(2);
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'three'});
      });
      nq(done);
    });
  });

  it('reorders', done => {
    component = StageComponent
      .withResources(['src/reorderable-repeat'])
      .inView(`<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">\${obj.name}</div>`)
      .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

    component.create().then(() => {
      const reorderableRepeat = component.sut;
      const viewModel = component.viewModel;

      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'two'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'two'}, {name: 'three'}]);
      });
      nq(() => {
        // move to upper half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
      });
      nq(() => {
        // no change yet.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'two'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'two'}, {name: 'three'}]);
      });
      nq(() => {
        // move to bottom half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        // swapped.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'two'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'two'}, {name: 'three'}]);
      });
      nq(() => {
        // move to bottom half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
      });
      nq(() => {
        // no change yet.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'two'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'two'}, {name: 'three'}]);
      });
      nq(() => {
        // move to top half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
      });
      nq(() => {
        // reorder again.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'two'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'two'}, {name: 'three'}]);
      });
      nq(() => {
        // move to bottom half of 3rd reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
      });
      nq(() => {
        // reorder again.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'two'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'two'}, {name: 'three'}]);
      });
      nq(() => {
        // drop it
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 126});
      });
      nq(() => {
        // reorder viewmodel.
        expect(viewModel.items).toEqual([{name: 'two'}, {name: 'three'}, {name: 'one'}]);
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'two'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(done);
    });
  });

  it('reorders duplicated strings', done => {
    component = StageComponent
      .withResources(['src/reorderable-repeat'])
      .inView(`<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">\${obj.name}</div>`)
      .boundTo({items: [{name: 'one'}, {name: 'one'}, {name: 'three'}]});

    component.create().then(() => {
      const reorderableRepeat = component.sut;
      const viewModel = component.viewModel;

      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'one'}, {name: 'three'}]);
      });
      nq(() => {
        // move to upper half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
      });
      nq(() => {
        // no change yet.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'one'}, {name: 'three'}]);
      });
      nq(() => {
        // move to bottom half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        // swapped 1st 'one' with 2nd 'one'.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'one'}, {name: 'three'}]);
      });
      nq(() => {
        // move to bottom half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
      });
      nq(() => {
        // no change yet.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'one'}, {name: 'three'}]);
      });
      nq(() => {
        // move to top half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
      });
      nq(() => {
        // reorder again.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'one'}, {name: 'three'}]);
      });
      nq(() => {
        // move to bottom half of 3rd reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
      });
      nq(() => {
        // reorder again.
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'one'}, {name: 'three'}]);
      });
      nq(() => {
        // drop mouse outside still trigger reordering
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 150, clientY: 126});
      });
      nq(() => {
        // reorder viewmodel.
        expect(viewModel.items).toEqual([{name: 'one'}, {name: 'three'}, {name: 'one'}]);
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.view(0).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.view(1).bindingContext.obj).toEqual({name: 'three'});
        expect(reorderableRepeat.view(2).bindingContext.obj).toEqual({name: 'one'});
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(done);
    });
  });
});

