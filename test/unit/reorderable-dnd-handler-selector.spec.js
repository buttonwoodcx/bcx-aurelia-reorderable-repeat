import {createAssertionQueue, fireEvent} from './utils';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import $ from 'jquery';

const nq = createAssertionQueue();
const doc = document;
const documentElement = doc.documentElement;
describe('reorderable-dnd-handler-selector:', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.dispose();
      component = null;
    }
  });

  it('starts dnd inside handler', done => {
    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-dnd-handler-selector'])
      .inView(`
        <div style="height: 50px; width: 100px; position: relative;"
          reorderable-repeat.for="obj of items"
          reorderable-dnd-handler-selector=".handler">
          <div class="handler" style="position: absolute; top: 0; left: 0; width: 20px; height: 20px;"></div>
          \${obj.name}
        </div>`)
      .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}]});

    component.create(bootstrap).then(() => {
      const reorderableRepeat = component.viewModel;
      const viewModel = component.viewModel;

      nq(() => {
        expect(reorderableRepeat.viewCount()).toEqual(3);
        expect($(reorderableRepeat.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(reorderableRepeat.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 40});
        // first small movement
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        // mousedown outside of handler does not trigger dnd
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        fireEvent($(reorderableRepeat.view(0).firstChild).find('.handler').get(0), 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement
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
});
