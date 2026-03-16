import test from "node:test";
import assert from "node:assert/strict";
import { Store } from "./createStore.ts";

test("store notifies listeners when state changes", () => {
  const store = new Store({ count: 0 });
  const calls: number[] = [];

  const unsubscribe = store.subscribe((state) => {
    calls.push(state.count);
  });

  store.update((current) => ({ count: current.count + 1 }));
  store.update((current) => ({ count: current.count + 1 }));
  unsubscribe();
  store.update((current) => ({ count: current.count + 1 }));

  assert.deepEqual(calls, [1, 2]);
  assert.equal(store.getState().count, 3);
});

test("store skips notifications when updater returns the same object", () => {
  const initialState = { count: 0 };
  const store = new Store(initialState);
  let callCount = 0;

  store.subscribe(() => {
    callCount += 1;
  });

  store.update((current) => current);

  assert.equal(callCount, 0);
});
