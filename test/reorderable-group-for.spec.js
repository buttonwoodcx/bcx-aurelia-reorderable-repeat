import {createAssertionQueue, fireEvent} from './utils';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

const nq = createAssertionQueue();
const doc = document;
const documentElement = doc.documentElement;

describe('reorderable-group:', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.dispose();
      component = null;
    }
  });

  it('ignores hover when intention was set', done => {
    let model = {
      numbers: [{value: 1}, {value: 2}, {value: 3}],
      letters: [{value: 'a'}, {value: 'b'}]
    };

    component = StageComponent
      .withResources(['reorderable-repeat', 'reorderable-group', 'reorderable-group-for'])
      .inView(`
          <div id="numbers" style="width: 50px; display: inline-block; vertical-align: top; padding-top: 50px;"
               reorderable-group-for.bind="numbers">
            <div style="height: 50px; width: 50px;" reorderable-repeat.for="o of numbers" reorderable-group="g">$\{o.value}</div>
          </div>
          <div id="letters" style="width: 50px; display: inline-block; vertical-align: top; padding-top: 50px;"
               reorderable-group-for.bind="letters">
            <div style="height: 50px; width: 50px;" reorderable-repeat.for="o of letters" reorderable-group="g">$\{o.value}</div>
          </div>
        `)
      .boundTo(model);

    component.create(bootstrap).then(() => {
      const viewModel = component.viewModel;

      nq(() => {
        const secondNumberDiv = doc.elementFromPoint(25, 125);
        fireEvent(secondNumberDiv, 'mousedown', {which: 1, clientX: 24, clientY: 125});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 25, clientY: 125});
      });
      nq(() => {
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(3);
        expect(letters.childElementCount).toEqual(2);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(numbers.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 2}, {value: 3}],
          letters: [{value: 'a'}, {value: 'b'}]
        });
      });
      nq(() => {
        // move to bottom half of 2nd element in letters
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 140});
      });
      nq(() => {
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(2);
        expect(letters.childElementCount).toEqual(3);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(numbers.children[0].textContent).toBe('1');
        expect(numbers.children[1].textContent).toBe('3');
        expect(letters.children[0].textContent).toBe('a');
        expect(letters.children[1].textContent).toBe('b');
        expect(letters.children[2].textContent).toBe('2');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 2}, {value: 3}],
          letters: [{value: 'a'}, {value: 'b'}]
        });
      });
      nq(() => {
        // move to top region of group-for letters
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 5});
      });
      nq(() => {
        // nothing change since intention is already in letters
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(2);
        expect(letters.childElementCount).toEqual(3);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(numbers.children[0].textContent).toBe('1');
        expect(numbers.children[1].textContent).toBe('3');
        expect(letters.children[0].textContent).toBe('a');
        expect(letters.children[1].textContent).toBe('b');
        expect(letters.children[2].textContent).toBe('2');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 2}, {value: 3}],
          letters: [{value: 'a'}, {value: 'b'}]
        });
      });
      nq(() => {
        // move to top half of 1st element in letters
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 55});
      });
      nq(() => {
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(2);
        expect(letters.childElementCount).toEqual(3);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[0].textContent).toBe('1');
        expect(numbers.children[1].textContent).toBe('3');
        expect(letters.children[0].textContent).toBe('2');
        expect(letters.children[1].textContent).toBe('a');
        expect(letters.children[2].textContent).toBe('b');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 2}, {value: 3}],
          letters: [{value: 'a'}, {value: 'b'}]
        });
      });
      nq(() => {
        // drop it
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 75, clientY: 55});
      });
      nq(() => {
        // reorder viewmodel.
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(2);
        expect(letters.childElementCount).toEqual(3);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[0].textContent).toBe('1');
        expect(numbers.children[1].textContent).toBe('3');
        expect(letters.children[0].textContent).toBe('2');
        expect(letters.children[1].textContent).toBe('a');
        expect(letters.children[2].textContent).toBe('b');
        expect(viewModel.dndService.isProcessing).toBeFalsy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 3}],
          letters: [{value: 2}, {value: 'a'}, {value: 'b'}]
        });
      });
      nq(done);
    });
  });

  it('inits intention if intention was not set or did not set toRepeater to this repeater', done => {
    let model = {
      numbers: [{value: 1}, {value: 2}, {value: 3}],
      letters: [{value: 'a'}, {value: 'b'}]
    };

    component = StageComponent
      .withResources(['reorderable-repeat', 'reorderable-group', 'reorderable-group-for'])
      .inView(`
          <div id="numbers" style="width: 50px; display: inline-block; vertical-align: top; padding-top: 50px;"
               reorderable-group-for.bind="numbers">
            <div style="height: 50px; width: 50px;" reorderable-repeat.for="o of numbers" reorderable-group="g">$\{o.value}</div>
          </div>
          <div id="letters" style="width: 50px; display: inline-block; vertical-align: top; padding-top: 50px;"
               reorderable-group-for.bind="letters">
            <div style="height: 50px; width: 50px;" reorderable-repeat.for="o of letters" reorderable-group="g">$\{o.value}</div>
          </div>
        `)
      .boundTo(model);

    component.create(bootstrap).then(() => {
      const viewModel = component.viewModel;

      nq(() => {
        const secondNumberDiv = doc.elementFromPoint(25, 125);
        fireEvent(secondNumberDiv, 'mousedown', {which: 1, clientX: 24, clientY: 125});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 25, clientY: 125});
      });
      nq(() => {
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(3);
        expect(letters.childElementCount).toEqual(2);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(numbers.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 2}, {value: 3}],
          letters: [{value: 'a'}, {value: 'b'}]
        });
      });
      nq(() => {
        // move to top region of group-for letters
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 5});
      });
      nq(() => {
        // by default, init intention append item to target array.
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(2);
        expect(letters.childElementCount).toEqual(3);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(numbers.children[0].textContent).toBe('1');
        expect(numbers.children[1].textContent).toBe('3');
        expect(letters.children[0].textContent).toBe('a');
        expect(letters.children[1].textContent).toBe('b');
        expect(letters.children[2].textContent).toBe('2');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 2}, {value: 3}],
          letters: [{value: 'a'}, {value: 'b'}]
        });
      });
      nq(() => {
        // move to top region of group-for numbers
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 25, clientY: 5});
      });
      nq(() => {
        // by default, init intention append item to target array.
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(3);
        expect(letters.childElementCount).toEqual(2);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[0].textContent).toBe('1');
        expect(numbers.children[1].textContent).toBe('3');
        expect(numbers.children[2].textContent).toBe('2');
        expect(letters.children[0].textContent).toBe('a');
        expect(letters.children[1].textContent).toBe('b');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 2}, {value: 3}],
          letters: [{value: 'a'}, {value: 'b'}]
        });
      });
      nq(() => {
        // move to top half of 1st element in letters
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 55});
      });
      nq(() => {
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(2);
        expect(letters.childElementCount).toEqual(3);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeTruthy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[0].textContent).toBe('1');
        expect(numbers.children[1].textContent).toBe('3');
        expect(letters.children[0].textContent).toBe('2');
        expect(letters.children[1].textContent).toBe('a');
        expect(letters.children[2].textContent).toBe('b');
        expect(viewModel.dndService.isProcessing).toBeTruthy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 2}, {value: 3}],
          letters: [{value: 'a'}, {value: 'b'}]
        });
      });
      nq(() => {
        // drop it
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 75, clientY: 55});
      });
      nq(() => {
        // reorder viewmodel.
        const numbers = doc.querySelector('#numbers');
        const letters = doc.querySelector('#letters');

        expect(numbers.childElementCount).toEqual(2);
        expect(letters.childElementCount).toEqual(3);
        expect(numbers.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[0].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[1].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(letters.children[2].classList.contains('reorderable-repeat-dragging-me')).toBeFalsy();
        expect(numbers.children[0].textContent).toBe('1');
        expect(numbers.children[1].textContent).toBe('3');
        expect(letters.children[0].textContent).toBe('2');
        expect(letters.children[1].textContent).toBe('a');
        expect(letters.children[2].textContent).toBe('b');
        expect(viewModel.dndService.isProcessing).toBeFalsy();
        expect(model).toEqual({
          numbers: [{value: 1}, {value: 3}],
          letters: [{value: 2}, {value: 'a'}, {value: 'b'}]
        });
      });
      nq(done);
    });
  });
});
