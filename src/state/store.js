import { DEFAULT_PLACE } from "../data/config.js";

// App state (shape in plan.md, Module pattern):
//   status:  "idle" | "loading" | "ready" | "error"
//   error:   null | "not-found" | "network"
//   place:   the place being shown or loaded
//   weather: null, or the object processWeather() returns
const initialState = {
  status: "idle",
  error: null,
  place: DEFAULT_PLACE,
  weather: null,
};

// A small publish/subscribe store. setState() makes a new state object by
// shallow-merging the patch, so subscribers can compare state with prevState.
export function createStore(initial) {
  let state = Object.freeze({ ...initial });
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(patch) {
    const prevState = state;
    state = Object.freeze({ ...state, ...patch });
    // Copy first, so a listener that unsubscribes during the loop doesn't
    // make the loop skip another listener.
    [...listeners].forEach((listener) => listener(state, prevState));
  }

  // Calls `listener(state, prevState)` after every setState(), not straight
  // away: a section draws its first frame from getState(). Returns a function
  // that removes the listener; calling it again does nothing.
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

const store = createStore(initialState);

export const { getState, setState, subscribe } = store;
