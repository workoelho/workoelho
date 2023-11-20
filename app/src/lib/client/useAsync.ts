import { useCallback, useEffect, useReducer, useRef } from "react";

type State<Data> = {
  state: "idle" | "busy" | "done" | "failed";
  data?: Data;
  error?: unknown;
};

type Executor<P extends any[], R> = (...args: P) => Promise<R>;

export function useAsync<P extends any[], R>(executor: Executor<P, R>) {
  const [{ error, data, state }, dispatch] = useReducer(
    (state: State<R>, patch: Partial<State<R>>) => {
      if (state.state === patch.state) {
        return state;
      }
      return { ...state, ...patch };
    },
    { state: "idle" },
  );

  const executorRef = useRef(executor);
  useEffect(() => {
    executorRef.current = executor;
  });

  const execute = useCallback(async (...args: P) => {
    dispatch({ state: "busy" });

    try {
      const data = await executorRef.current(...args);
      dispatch({ data, state: "done" });
      return data;
    } catch (error) {
      dispatch({ error, state: "failed" });
      throw error;
    }
  }, []);

  return { error, data, state, execute } as const;
}
