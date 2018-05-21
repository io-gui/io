const __debounceTimeout = new WeakMap();

export function debounce(func, wait) {
  clearTimeout(__debounceTimeout.get(func));
  __debounceTimeout.set(func, setTimeout(func, wait));
}

export function path(path, importurl) {
  return new URL(path, importurl).pathname;
}
