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
        expect(change).toEqual({item: 1, fromIndex: 0, toIndex: 1, removedFromThisList: true, insertedToThisList: true});
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
        expect(change).toEqual({item: {name: 'one'}, fromIndex: 0, toIndex: 1, removedFromThisList: true, insertedToThisList: true});
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

describe('reorderable-repeat: with multiple lists', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.dispose();
      component = null;
    }
  });

  it('call after reordering with string', done => {
    const numbers = [{value: 1}, {value: 2}, {value: 3}];
    const letters = [{value: 'a'}, {value: 'b'}];

    let seenItems1;
    let change1;
    function action1(items, c) {
      seenItems1 = items;
      change1 = c;
    }

    let seenItems2;
    let change2;
    function action2(items, c) {
      seenItems2 = items;
      change2 = c;
    }

    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-after-reordering', 'resources/reorderable-group', 'resources/reorderable-group-for'])
      .inView(`
          <div id="numbers" style="width: 50px; display: inline-block; vertical-align: top; padding-top: 50px;"
               reorderable-group-for.bind="numbers">
            <div style="height: 50px; width: 50px;" reorderable-repeat.for="o of numbers" reorderable-group="g" reorderable-after-reordering="action1">$\{o.value}</div>
          </div>
          <div id="letters" style="width: 50px; display: inline-block; vertical-align: top; padding-top: 50px;"
               reorderable-group-for.bind="letters">
            <div style="height: 50px; width: 50px;" reorderable-repeat.for="o of letters" reorderable-group="g" reorderable-after-reordering="action2">$\{o.value}</div>
          </div>
        `)
      .boundTo({numbers, letters, action1, action2});

    component.create(bootstrap).then(() => {
      const reorderableRepeat = component.viewModel;

      nq(() => {
        const secondNumberDiv = doc.elementFromPoint(25, 125);
        fireEvent(secondNumberDiv, 'mousedown', {which: 1, clientX: 24, clientY: 125});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 25, clientY: 125});
      });
      nq(() => {
        // move to bottom half of 2nd element in letters
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 140});
      });
      nq(() => {
        // drop on bottom half of 2nd element in letters
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 75, clientY: 140});
      });
      nq(() => {
        expect(reorderableRepeat.dndService.isProcessing).toBeFalsy();
      });
      nq(() => {
        expect(seenItems1).toEqual([{value: 1}, {value: 3}]);
        expect(seenItems2).toEqual([{value: 'a'}, {value: 'b'}, {value: 2}]);
        expect(change1).toEqual({item: {value: 2}, fromIndex: 1, toIndex: 2, removedFromThisList: true});
        expect(change2).toEqual({item: {value: 2}, fromIndex: 1, toIndex: 2, insertedToThisList: true});
      });
      nq(done);
    });
  });
});
