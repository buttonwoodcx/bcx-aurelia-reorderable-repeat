# bcx-aurelia-reorderable-repeat [![Build Status](https://travis-ci.org/buttonwoodcx/bcx-aurelia-reorderable-repeat.svg?branch=master)](https://travis-ci.org/buttonwoodcx/bcx-aurelia-reorderable-repeat)

An Aurelia repeater supports drag & drop reordering automatically.

## Usage

* With aurelia-cli, just do `au install bcx-aurelia-reorderable-repeat`.
* In you app main.js file, `aurelia.use.plugin(PLATFORM.moduleName('bcx-aurelia-reorderable-repeat'));`.
* Simply use `reorderable-repeat.for="item of items"` in your view template. That's it!

Read full documentation [here](https://buttonwoodcx.github.io/bcx-aurelia-dnd/#/bcx-aurelia-reorderable-repeat)

## Building The Code (from skeleton-plugin readme)

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests (from skeleton-plugin readme)

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

  ```shell
  npm install -g jspm
  ```
3. Install the client-side dependencies with jspm:

  ```shell
  jspm install
  ```

4. You can now run the tests with this command:

  ```shell
  karma start
  ```
