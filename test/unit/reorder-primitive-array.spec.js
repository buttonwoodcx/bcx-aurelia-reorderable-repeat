import {createAssertionQueue, fireEvent} from './utils';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import $ from 'jquery';

const nq = createAssertionQueue();
const doc = document;
const documentElement = doc.documentElement;

describe('reorderable-repeat: primitive array', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.dispose();
      component = null;
    }
  });

  it('render empty list', done => {
    component = StageComponent
      .withResources(['resources/reorderable-repeat'])
      .inView('<div style="height: 50px; width: 100px;" reorderable-repeat.for="obj of items">\${obj}</div>')
      .boundTo({items: []});

    component.create(bootstrap).then(() => {
      const viewModel = component.viewModel;

      nq(() => expect(viewModel.viewCount()).toEqual(0));
      nq(() => viewModel.items.push('lorem'));
      nq(() => {
        expect(viewModel.viewCount()).toEqual(1);
        expect(viewModel.view(0).bindingContext.obj).toEqual('lorem');
      });
      nq(done);
    });
  });

  it('render list', done => {
    component = StageComponent
      .withResources(['resources/reorderable-repeat'])
      .inView('<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">\${obj}</div>')
      .boundTo({items: ['one', 'two', 'three']});

    component.create(bootstrap).then(() => {
      const viewModel = component.viewModel;

      nq(() => expect(viewModel.viewCount()).toEqual(3));
      nq(() => viewModel.items.splice(1,1));
      nq(() => {
        expect(viewModel.viewCount()).toEqual(2);
        expect(viewModel.view(0).bindingContext.obj).toEqual('one');
        expect(viewModel.view(1).bindingContext.obj).toEqual('three');
      });
      nq(done);
    });
  });

  it('reorders', done => {
    component = StageComponent
      .withResources(['resources/reorderable-repeat'])
      .inView('<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">\${obj}</div>')
      .boundTo({items: ['one', 'two', 'three']});

    component.create(bootstrap).then(() => {
      const viewModel = component.viewModel;

      nq(() => {
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        fireEvent(viewModel.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('two');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'two', 'three']);
      });
      nq(() => {
        // move to upper half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
      });
      nq(() => {
        // no change yet.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('two');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'two', 'three']);
      });
      nq(() => {
        // move to bottom half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        // swapped.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('two');
        expect(viewModel.view(1).bindingContext.obj).toBe('one');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'two', 'three']);
      });
      nq(() => {
        // move to bottom half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
      });
      nq(() => {
        // no change yet.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('two');
        expect(viewModel.view(1).bindingContext.obj).toBe('one');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'two', 'three']);
      });
      nq(() => {
        // move to top half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
      });
      nq(() => {
        // reorder again.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('two');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'two', 'three']);
      });
      nq(() => {
        // move to bottom half of 3rd reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
      });
      nq(() => {
        // reorder again.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(viewModel.view(0).bindingContext.obj).toBe('two');
        expect(viewModel.view(1).bindingContext.obj).toBe('three');
        expect(viewModel.view(2).bindingContext.obj).toBe('one');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'two', 'three']);
      });
      nq(() => {
        // drop it
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 126});
      });
      nq(() => {
        // reorder viewmodel.
        expect(viewModel.items).toEqual(['two', 'three', 'one']);
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('two');
        expect(viewModel.view(1).bindingContext.obj).toBe('three');
        expect(viewModel.view(2).bindingContext.obj).toBe('one');
        expect(viewModel.dndService.isProcessing).toBeFalsy();
      });
      nq(done);
    });
  });

  it('reorders duplicated strings', done => {
    component = StageComponent
      .withResources(['resources/reorderable-repeat'])
      .inView('<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">\${obj}</div>')
      .boundTo({items: ['one', 'one', 'three']});

    component.create(bootstrap).then(() => {
      const viewModel = component.viewModel;

      nq(() => {
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        fireEvent(viewModel.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('one');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'one', 'three']);
      });
      nq(() => {
        // move to upper half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 74});
      });
      nq(() => {
        // no change yet.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('one');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'one', 'three']);
      });
      nq(() => {
        // move to bottom half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        // swapped 1st 'one' with 2nd 'one'.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('one');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'one', 'three']);
      });
      nq(() => {
        // move to bottom half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 26});
      });
      nq(() => {
        // no change yet.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('one');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'one', 'three']);
      });
      nq(() => {
        // move to top half of 1st reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 24});
      });
      nq(() => {
        // reorder again.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('one');
        expect(viewModel.view(2).bindingContext.obj).toBe('three');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'one', 'three']);
      });
      nq(() => {
        // move to bottom half of 3rd reordered element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 126});
      });
      nq(() => {
        // reorder again.
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('three');
        expect(viewModel.view(2).bindingContext.obj).toBe('one');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(viewModel.items).toEqual(['one', 'one', 'three']);
      });
      nq(() => {
        // drop mouse outside still trigger reordering
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 150, clientY: 126});
      });
      nq(() => {
        // reorder viewmodel.
        expect(viewModel.items).toEqual(['one', 'three', 'one']);
        expect(viewModel.viewCount()).toEqual(3);
        expect($(viewModel.view(0).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(1).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect($(viewModel.view(2).firstChild).hasClass('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.view(0).bindingContext.obj).toBe('one');
        expect(viewModel.view(1).bindingContext.obj).toBe('three');
        expect(viewModel.view(2).bindingContext.obj).toBe('one');
        expect(viewModel.dndService.isProcessing).toBeFalsy();
      });
      nq(done);
    });
  });
});

