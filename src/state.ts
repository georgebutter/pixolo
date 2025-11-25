export const state = <T>(initialState: T, config?: Config<T>): State<T> => {
  let currentState: T = initialState;
  const listeners: Array<(state: T) => void> = [];
  if (config?.onChange) {
    listeners.push(config.onChange);
    config.onChange(currentState);
  }
  const set = (setter: (prev: T) => T) => {
    const next = setter(currentState);
    currentState = next;
    listeners.forEach((fn) => fn(currentState));
  }
  const get = () => {
    return currentState
  }
  const subscribe = (fn: (state: T) => void) => {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  };
  return {
    get,
    set,
    subscribe,
  }
}

export type State<T> = {
  get: Getter<T>;
  set: Setter<T>;
  subscribe?: (fn: (state: T) => void) => () => void;
}

export type Config<T> = {
  onChange: (prev: T) => void;
}

export type Getter<T> = () => T;
export type Setter<T> = (setter: (prev: T) => T) => void