// copied from dragula test/lib/events.js
export function fireEvent(el, type, options) {
  const o = options || {};
  const e = document.createEvent('Event');
  e.initEvent(type, true, true);
  Object.keys(o).forEach(apply);
  el.dispatchEvent(e);
  function apply(key) {
    e[key] = o[key];
  }
}

export function delay(ms = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
