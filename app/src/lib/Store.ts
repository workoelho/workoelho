import { useMemo, useSyncExternalStore } from "react";

type State = Record<string, unknown>;

type Handler<S extends State> = (value: unknown, store: Store<S>) => void;

type Subscription<S extends State> = {
  key?: string;
  handler: Handler<S>;
};

class Store<S extends State> {
  subscribers = new Array<Subscription<S>>();

  constructor(public state = {} as S) {}

  update(name: string, value: unknown) {
    this.state = Object.assign(this.state, { [name]: value });

    for (const { key, handler } of this.subscribers) {
      if (key === name || key === undefined) {
        handler(value, this);
      }
    }
  }

  subscribe(key: string, handler: Handler<S>): void;
  subscribe(handler: Handler<S>): void;
  subscribe(mixed: string | Handler<S>, handler?: Handler<S>) {
    if (typeof mixed === "string") {
      if (!handler) {
        throw new Error("Missing handler");
      }
      this.subscribers.push({ key: mixed, handler });
    } else {
      this.subscribers.push({ handler: mixed });
    }
  }

  unsubscribe(handler: Handler<S>) {
    this.subscribers = this.subscribers.filter(
      (subscription) => subscription.handler !== handler
    );
  }
}

function useStore<S extends State>(initialState = {} as S) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => new Store(initialState), []);
}

function useStoreState<S extends State>(store: Store<S>) {
  return useSyncExternalStore(
    (onStoreChange) => {
      store.subscribe(onStoreChange);
      return () => store.unsubscribe(onStoreChange);
    },
    () => store.state
  );
}

function useStoreValue<S extends State>(store: Store<S>, key: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      store.subscribe(key, onStoreChange);
      return () => store.unsubscribe(onStoreChange);
    },
    () => store.state[key]
  );
}
