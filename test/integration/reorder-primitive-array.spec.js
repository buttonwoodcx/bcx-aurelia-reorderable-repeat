/* global describe, it, beforeEach, expect, fail */
import {StageComponent} from '../component-tester';

describe('reorderable-repeat', () => {

  it('render empty list', done => {
    const component = StageComponent
      .withResources(['src/reorderable-repeat'])
      .inView(`<div style="height: 50px;width:100px;" reorderable-repeat.for="obj of items">\${obj}</div>`)
      .boundTo({items: []});

    component.create().then(
      () => {
        const reorderableRepeat = component.sut;
        const viewModel = component.viewModel;

        expect(reorderableRepeat.viewCount()).toBe(0);
      },
      () => fail('fail to create component')
    ).then(() => {
      component.cleanUp();
      done();
    });
  });

  it('render list', done => {
    const component = StageComponent
      .withResources(['src/reorderable-repeat'])
      .inView(`<div style="height: 50px;width:100px;" reorderable-repeat.for="obj of items">\${obj}</div>`)
      .boundTo({items: ['one', 'two', 'three']});

    component.create().then(
      () => {
        const reorderableRepeat = component.sut;
        const viewModel = component.viewModel;

        expect(reorderableRepeat.viewCount()).toBe(3);
      },
      () => fail('fail to create component')
    ).then(() => {
      component.cleanUp();
      done();
    });
  });
});

