export class App {
  stringArray = ['A', 'A', 'B', 'C'];

  objArray = [
    {name: 'Abi'},
    {name: 'Bob'},
    {name: 'Cherry'}
  ];

  objArrayReordered(objArray) {
    /* eslint no-console: 0 */
    console.log(JSON.stringify(objArray));
  }
}
