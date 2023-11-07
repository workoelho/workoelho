import { useCallback, useEffect, useReducer, useRef } from "react";

type State<Data> = {
  state: "idle" | "loading" | "success" | "error";
  data?: Data;
  error?: unknown;
};

type Fetcher<A extends any[], D> = (...args: A) => Promise<D>;

export function useAsync<A extends any[], T>(fetcher: Fetcher<A, T>) {
  const [{ error, data, state }, dispatch] = useReducer(
    (state: State<T>, patch: Partial<State<T>>) => {
      if (state.state === patch.state) {
        return state;
      }
      return { ...state, ...patch };
    },
    { state: "idle" },
  );

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const execute = useCallback(async (...args: A) => {
    dispatch({ state: "loading" });

    try {
      const data = await fetcherRef.current(...args);
      dispatch({ data, state: "success" });
      return data;
    } catch (error) {
      dispatch({ error, state: "error" });
    }
  }, []);

  return { error, data, state, execute } as const;
}
