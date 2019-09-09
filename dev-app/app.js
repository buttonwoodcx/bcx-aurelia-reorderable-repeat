import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class App {
  stringArray = ['A', 'A', 'B', 'C'];

  objArray = [
    {name: 'Abi'},
    {name: 'Bob'},
    {name: 'Cherry'}
  ];

  fruits = ['Apple', 'Pineapple', 'Banana'];
  animals = ['Cow', 'Horse', 'Sheep', 'Goat'];
  insects = ['Grasshopper', 'Fly', 'Dragonfly', 'Frog'];

  objArrayReordered(objArray, change) {
    /* eslint no-console: 0 */
    console.log(JSON.stringify(objArray));
    console.log('change', change);
  }

  fruitsOrdered(list, change) {
    console.log('newFruits: ' + list);
    console.log('change', change);
  }

  animalsOrdered(list, change) {
    console.log('animals: ' + list);
    console.log('change', change);
  }

  insectsOrdered(list, change) {
    console.log('insects: ' + list);
    console.log('change', change);
  }

  constructor(ea) {
    ea.subscribe('reorderable-group:intention-changed', intention => {
      this.intention = intention;
    });
  }
}
