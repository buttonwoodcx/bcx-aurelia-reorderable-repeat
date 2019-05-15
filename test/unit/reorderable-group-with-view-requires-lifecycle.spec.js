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

  it('supports multiple repeats in one group', done => {
    let model = {
      numbers: [{value: 1}, {value: 2}, {value: 3}],
      letters: [{value: 'a'}, {value: 'b'}]
    };

    component = StageComponent
      .withResources(['resources/reorderable-repeat', 'resources/reorderable-group', 'box'])
      .inView(`
          <div id="numbers" style="width: 50px; display: inline-block; vertical-align: top;">
            <box style="height: 50px; width: 50px;" reorderable-repeat.for="o of numbers" reorderable-group="g">$\{o.value}</box>
          </div>
          <div id="letters" style="width: 50px; display: inline-block; vertical-align: top;">
            <box style="height: 50px; width: 50px;" reorderable-repeat.for="o of letters" reorderable-group="g">$\{o.value}</box>
          </div>
        `)
      .boundTo(model);

    component.create(bootstrap).then(() => {
      const viewModel = component.viewModel;

      nq(() => {
        const secondNumberDiv = doc.elementFromPoint(25, 75);
        fireEvent(secondNumberDiv, 'mousedown', {which: 1, clientX: 24, clientY: 75});
        // first small movement, this is where dnd starts
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 25, clientY: 75});
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
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 90});
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
        // move to top half of 1st element in letters
        fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 5});
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
        fireEvent(documentElement, 'mouseup', {which: 1, clientX: 75, clientY: 5});
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
