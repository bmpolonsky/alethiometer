type Listener<TState> = (state: TState) => void;
type Updater<TState> = (state: TState) => TState;

export class Store<TState> {
  private state: TState;

  private listeners = new Set<Listener<TState>>();

  constructor(initialState: TState) {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  subscribe(listener: Listener<TState>) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  update(updater: Updater<TState>) {
    const nextState = updater(this.state);

    if (Object.is(nextState, this.state)) {
      return;
    }

    this.state = nextState;

    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}
