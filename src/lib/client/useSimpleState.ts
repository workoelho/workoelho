import { useReducer } from "react";

export function useSimpleState<T extends Record<string, unknown>>(
  initialValue: T
) {
  return useReducer(
    (state: T, patch: Partial<T>) => ({ ...state, ...patch }),
    initialValue
  );
}
