import { useEffect, useState } from "react";
import type { Store } from "./createStore";

export function useStore<TState>(store: Store<TState>) {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);

    return unsubscribe;
  }, [store]);

  return state;
}
