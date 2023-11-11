import { useCallback, useReducer } from "react";

function reducer(state: boolean, override: undefined | boolean) {
  return override ?? !state;
}

export function useToggle(initialValue = false) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const toggle = useCallback((state?: boolean) => dispatch(state), []);
  return [state, toggle] as const;
}
