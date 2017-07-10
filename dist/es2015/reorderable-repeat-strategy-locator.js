import { ArrayRepeatStrategy } from 'aurelia-templating-resources';

export let ReorderableRepeatStrategyLocator = class ReorderableRepeatStrategyLocator {
  constructor() {
    this.matchers = [];
    this.strategies = [];
    this.addStrategy(items => items instanceof Array, new ArrayRepeatStrategy());
  }

  addStrategy(matcher, strategy) {
    this.matchers.push(matcher);
    this.strategies.push(strategy);
  }

  getStrategy(items) {
    let matchers = this.matchers;

    for (let i = 0, ii = matchers.length; i < ii; ++i) {
      if (matchers[i](items)) {
        return this.strategies[i];
      }
    }

    return null;
  }
};