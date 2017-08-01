/* global describe, it, beforeEach, afterEach, expect, fail */
import {StageComponent, createAssertionQueue, fireEvent} from '../component-tester';
import $ from 'jquery';

const nq = createAssertionQueue();
const doc = document;
const documentElement = doc.documentElement;
describe('reorderable-direction:', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.cleanUp();
      component = null;
    }
  });

  it('flow to right', done => {
    component = StageComponent
      .withResources(['src/reorderable-repeat', 'src/reorderable-direction'])
      .inView(`
        <div style="height: 50px; width: 50px; float: left;"
          reorderable-repeat.for="obj of items"
          reorderable-direction="right">
          \${obj.name}
        </div>`)
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
        // move to left half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 74, clientY: 20});
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
        // move to right half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 76, clientY: 20});
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
        // move to right half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 26, clientY: 20});
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
        // move to left half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 24, clientY: 20});
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
        // move to right half of 3rd reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 126, clientY: 20});
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
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 126, clientY: 20});
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

  it('flow to left', done => {
    component = StageComponent
      .withResources(['src/reorderable-repeat', 'src/reorderable-direction'])
      .inView(`
        <div style="height: 100px; width: 200px;">
          <div style="height: 50px; width: 50px; float: right;"
            reorderable-repeat.for="obj of items"
            reorderable-direction="left">
            \${obj.name}
          </div>
        </div>`)
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
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 180, clientY: 20});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 180, clientY: 21});
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
        // move to right half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 126, clientY: 20});
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
        // move to left half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 124, clientY: 20});
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
        // move to left half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 174, clientY: 20});
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
        // move to right half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 176, clientY: 20});
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
        // move to left half of 3rd reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 74, clientY: 20});
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
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 74, clientY: 20});
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
});