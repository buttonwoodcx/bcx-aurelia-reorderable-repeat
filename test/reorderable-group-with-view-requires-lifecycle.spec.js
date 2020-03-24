import {delay, fireEvent} from './utils';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {default as _test} from 'tape-promise/tape';

const doc = document;
const documentElement = doc.documentElement;

let component;

function test(title, cb) {
  return _test(title, async t => {
    let err;
    try {
      await cb(t);
    } catch (e) {
      err = e;
    }

    if (component) {
      component.dispose();
      component = null;
    }

    if (err) throw err;
  });
}

test('reorderable-group: supports multiple repeats in one group', async t => {
  const model = {
    numbers: [{value: 1}, {value: 2}, {value: 3}],
    letters: [{value: 'a'}, {value: 'b'}]
  };

  component = StageComponent
    .withResources(['reorderable-repeat', 'reorderable-group', '../dev-app/box'])
    .inView(`
        <div id="numbers" style="width: 50px; display: inline-block; vertical-align: top;">
          <box style="height: 50px; width: 50px;" reorderable-repeat.for="o of numbers" reorderable-group="g">$\{o.value}</box>
        </div>
        <div id="letters" style="width: 50px; display: inline-block; vertical-align: top;">
          <box style="height: 50px; width: 50px;" reorderable-repeat.for="o of letters" reorderable-group="g">$\{o.value}</box>
        </div>
      `)
    .boundTo(model);

  component.create(bootstrap);
  await delay();
  const viewModel = component.viewModel;
  await delay();
  const secondNumberDiv = doc.elementFromPoint(25, 75);
  fireEvent(secondNumberDiv, 'mousedown', {which: 1, clientX: 24, clientY: 75});
  await delay();
  // first small movement, this is where dnd starts
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 25, clientY: 75});
  await delay();
  let numbers = doc.querySelector('#numbers');
  let letters = doc.querySelector('#letters');

  t.equal(numbers.childElementCount, 3);
  t.equal(letters.childElementCount, 2);
  t.notOk(numbers.children[0].classList.contains('reorderable-repeat-dragging-me'));
  t.ok(numbers.children[1].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(numbers.children[2].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(letters.children[0].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(letters.children[1].classList.contains('reorderable-repeat-dragging-me'));
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(model, {
    numbers: [{value: 1}, {value: 2}, {value: 3}],
    letters: [{value: 'a'}, {value: 'b'}]
  });
  await delay();
  // move to bottom half of 2nd element in letters
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 90});
  await delay();
  numbers = doc.querySelector('#numbers');
  letters = doc.querySelector('#letters');

  t.equal(numbers.childElementCount, 2);
  t.equal(letters.childElementCount, 3);
  t.notOk(numbers.children[0].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(numbers.children[1].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(letters.children[0].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(letters.children[1].classList.contains('reorderable-repeat-dragging-me'));
  t.ok(letters.children[2].classList.contains('reorderable-repeat-dragging-me'));
  t.equal(numbers.children[0].textContent, '1');
  t.equal(numbers.children[1].textContent, '3');
  t.equal(letters.children[0].textContent, 'a');
  t.equal(letters.children[1].textContent, 'b');
  t.equal(letters.children[2].textContent, '2');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(model, {
    numbers: [{value: 1}, {value: 2}, {value: 3}],
    letters: [{value: 'a'}, {value: 'b'}]
  });
  await delay();
  // move to top half of 1st element in letters
  fireEvent(documentElement, 'mousemove', {which: 1, clientX: 75, clientY: 5});
  await delay();
  numbers = doc.querySelector('#numbers');
  letters = doc.querySelector('#letters');

  t.equal(numbers.childElementCount, 2);
  t.equal(letters.childElementCount, 3);
  t.notOk(numbers.children[0].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(numbers.children[1].classList.contains('reorderable-repeat-dragging-me'));
  t.ok(letters.children[0].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(letters.children[1].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(letters.children[2].classList.contains('reorderable-repeat-dragging-me'));
  t.equal(numbers.children[0].textContent, '1');
  t.equal(numbers.children[1].textContent, '3');
  t.equal(letters.children[0].textContent, '2');
  t.equal(letters.children[1].textContent, 'a');
  t.equal(letters.children[2].textContent, 'b');
  t.ok(viewModel.dndService.isProcessing);
  t.deepEqual(model, {
    numbers: [{value: 1}, {value: 2}, {value: 3}],
    letters: [{value: 'a'}, {value: 'b'}]
  });
  await delay();
  // drop it
  fireEvent(documentElement, 'mouseup', {which: 1, clientX: 75, clientY: 5});
  await delay();
  // reorder viewmodel.
  numbers = doc.querySelector('#numbers');
  letters = doc.querySelector('#letters');

  t.equal(numbers.childElementCount, 2);
  t.equal(letters.childElementCount, 3);
  t.notOk(numbers.children[0].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(numbers.children[1].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(letters.children[0].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(letters.children[1].classList.contains('reorderable-repeat-dragging-me'));
  t.notOk(letters.children[2].classList.contains('reorderable-repeat-dragging-me'));
  t.equal(numbers.children[0].textContent, '1');
  t.equal(numbers.children[1].textContent, '3');
  t.equal(letters.children[0].textContent, '2');
  t.equal(letters.children[1].textContent, 'a');
  t.equal(letters.children[2].textContent, 'b');
  t.notOk(viewModel.dndService.isProcessing);
  t.deepEqual(model, {
    numbers: [{value: 1}, {value: 3}],
    letters: [{value: 2}, {value: 'a'}, {value: 'b'}]
  });
});
