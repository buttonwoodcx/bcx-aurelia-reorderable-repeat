import {SimpleArrayRepeatStrategy} from './simple-array-repeat-strategy';
import {ArrayRepeatStrategy} from 'aurelia-templating-resources';

export class ReorderableRepeatStrategyLocator {
  constructor() {
    this.matchers = [];
    this.strategies = [];
    this.addStrategy(items => {
      if (items instanceof Array) {
        // Simple strategy is only for array of primitive value
        return items.length === 0 || typeof items[0] !== 'object';
      }
    }, new SimpleArrayRepeatStrategy());
    this.addStrategy(items => {
      if (items instanceof Array) {
        // Normal strategy is only for array of non-primitive value
        return items.length && typeof items[0] === 'object';
      }
    }, new ArrayRepeatStrategy());
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
}
