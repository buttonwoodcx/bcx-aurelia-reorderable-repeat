import {createAssertionQueue, fireEvent} from './utils';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

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

  it('call after reordering with string', done => {
    let seenItems;
    let change;
    function action(items, c) {
      seenItems = items;
      change = c;
    }

    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-after-reordering'])
      .inView(`
        <div style="height: 50px; width: 100px;"
          reorderable-repeat.for="obj of items"
          reorderable-after-reordering="action">
          \${obj}
        </div>`)
      .boundTo({items: [1, 2, 3], action});

    component.create(bootstrap).then(() => {
      const reorderableRepeat = component.viewModel;

      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        // move to bottom half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        // drop on bottom half of 2nd element
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        expect(seenItems).toEqual([2, 1, 3]);
        expect(change).toEqual({fromIndex: 0, toIndex: 1});
      });
      nq(done);
    });
  });

  it('call after reordering with call binding', done => {
    let seenItems;
    function action(items) {
      seenItems = items;
    }

    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-after-reordering'])
      .inView(`
        <div style="height: 50px; width: 100px;"
          reorderable-repeat.for="obj of items"
          reorderable-after-reordering.call="action(items)">
          \${obj.name}
        </div>`)
      .boundTo({items: [1, 2, 3], action});

    component.create(bootstrap).then(() => {
      const reorderableRepeat = component.viewModel;

      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        // move to bottom half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        // drop on bottom half of 2nd element
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        expect(seenItems).toEqual([2, 1, 3]);
      });
      nq(done);
    });
  });
});

describe('reorderable-repeat: objects', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.dispose();
      component = null;
    }
  });

  it('call after reordering with string', done => {
    let seenItems;
    function action(items) {
      seenItems = items;
    }

    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-after-reordering'])
      .inView(`
        <div style="height: 50px; width: 100px;"
          reorderable-repeat.for="obj of items"
          reorderable-after-reordering="action">
          \${obj.name}
        </div>`)
      .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}], action});

    component.create(bootstrap).then(() => {
      const reorderableRepeat = component.viewModel;

      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        // move to bottom half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        // drop on bottom half of 2nd element
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        expect(seenItems).toEqual([{name: 'two'}, {name: 'one'}, {name: 'three'}]);
      });
      nq(done);
    });
  });

  it('call after reordering with call binding', done => {
    let seenItems;
    function action(items) {
      seenItems = items;
    }

    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-after-reordering'])
      .inView(`
        <div style="height: 50px; width: 100px;"
          reorderable-repeat.for="obj of items"
          reorderable-after-reordering.call="action(items)">
          \${obj.name}
        </div>`)
      .boundTo({items: [{name: 'one'}, {name: 'two'}, {name: 'three'}], action});

    component.create(bootstrap).then(() => {
      const reorderableRepeat = component.viewModel;

      nq(() => {
        fireEvent(reorderableRepeat.view(0).firstChild, 'mousedown', {which: 1, clientX: 20, clientY: 20});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 21});
      });
      nq(() => {
        // move to bottom half of 2nd element
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        // drop on bottom half of 2nd element
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 20, clientY: 76});
      });
      nq(() => {
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        expect(seenItems).toEqual([{name: 'two'}, {name: 'one'}, {name: 'three'}]);
      });
      nq(done);
    });
  });
});
