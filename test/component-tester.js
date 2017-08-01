import {bootstrap} from 'aurelia-bootstrapper';

export const StageComponent = {
  withResources(resources) {
    return new ComponentTester().withResources(resources);
  }
};

export class ComponentTester {
  _html;
  _resources = [];
  _bindingContext;
  _configure = aurelia => aurelia.use.standardConfiguration();
  cleanUp;
  element;
  sut;
  viewModel;
  aurelia;

  bootstrap(configure) {
    this._configure = configure;
  }

  withResources(resources) {
    this._resources = resources;
    return this;
  }

  inView(html) {
    this._html = html;
    return this;
  }

  boundTo(bindingContext) {
    this._bindingContext = bindingContext;
    return this;
  }

  create() {
    return bootstrap(aurelia => {
      return Promise.resolve(this._configure(aurelia)).then(() => {
        aurelia.use.globalResources(this._resources);

        return aurelia.start().then(a => {
          let host = document.createElement('div');
          host.innerHTML = this._html;
          document.body.appendChild(host);
          let x = aurelia.enhance(this._bindingContext, host);
          this.sut = aurelia.root.controllers[0].viewModel;
          this.viewModel = aurelia.root.bindingContext;
          this.element = host.firstElementChild;
          this.cleanUp = () => host.parentNode.removeChild(host);
        });
      });
    });
  }
}

// async queue
export function createAssertionQueue() {
  let queue = [];

  let next;
  next = () => {
    if (queue.length) {
      setTimeout(() => {
        let func = queue.shift();
        func();
        next();
      });
    }
  };

  return (func) => {
    queue.push(func);
    if (queue.length === 1) {
      next();
    }
  };
}

// copied from dragula test/lib/events.js
export function fireEvent(el, type, options) {
  var o = options || {};
  var e = document.createEvent('Event');
  e.initEvent(type, true, true);
  Object.keys(o).forEach(apply);
  el.dispatchEvent(e);
  function apply (key) {
    e[key] = o[key];
  }
}