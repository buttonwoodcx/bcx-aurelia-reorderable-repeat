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