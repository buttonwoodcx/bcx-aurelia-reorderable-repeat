export class App {
  stringArray = ['A', 'A', 'B', 'C'];

  objArray = [
    {name: 'Abi'},
    {name: 'Bob'},
    {name: 'Cherry'}
  ];

  objArrayReordered(objArray) {
    console.log(JSON.stringify(objArray));
  }
}
