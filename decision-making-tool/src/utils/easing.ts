export default class EasingTimerFunc {

  public static easeInOut(state: number): number {
    state = this.checkState(state);
    return state < 0.5 ? 2 * state * state : -1 + (4 - 2 * state) * state;
  }

  public static easeInOutBack(state: number): number {
    state = this.checkState(state);
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return state < 0.5
      ? (Math.pow(2 * state, 2) * ((c2 + 1) * 2 * state - c2)) / 2
      : (Math.pow(2 * state - 2, 2) * ((c2 + 1) * (state * 2 - 2) + c2) + 2) / 2;
  }

  private static checkState(state: number): number {
    if (state < 0) state = 0;
    if (state > 1) state = 1;
    return state;
  }
}