// Returns a function that runs `fn` once, `ms` milliseconds after the last
// call. `cancel()` drops a pending run.
export function debounce(fn, ms) {
  let timer;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  }

  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
