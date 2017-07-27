/* global describe, it, beforeEach, afterEach, expect, fail */
import {StageComponent, createAssertionQueue} from '../component-tester';

const nq = createAssertionQueue();

describe('reorderable-repeat', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.cleanUp();
      component = null;
    }
  });

  it('render empty list', done => {
    const component = StageComponent
      .withResources(['src/reorderable-repeat'])
      .inView(`<div style="height: 50px; width: 100px;" reorderable-repeat.for="obj of items">\${obj}</div>`)
      .boundTo({items: []});

    component.create().then(() => {
      const reorderableRepeat = component.sut;
      const viewModel = component.viewModel;

      nq(() => expect(reorderableRepeat.viewCount()).toEqual(0));
      nq(done);
    });
  });

  it('render list', done => {
    const component = StageComponent
      .withResources(['src/reorderable-repeat'])
      .inView(`<div style="height: 50px;w idth: 100px;" reorderable-repeat.for="obj of items">\${obj}</div>`)
      .boundTo({items: ['one', 'two', 'three']});

    component.create().then(() => {
      const reorderableRepeat = component.sut;
      const viewModel = component.viewModel;

      nq(() => expect(reorderableRepeat.viewCount()).toEqual(3));
      nq(done);
    });
  });
});

