const __debounceTimeout = new WeakMap();

export function html() {return arguments[0][0];}

export function debounce(func, wait) {
  clearTimeout(__debounceTimeout.get(func));
  __debounceTimeout.set(func, setTimeout(func, wait));
}

export function path(path, importurl) {
  return new URL(path, importurl).pathname;
}
