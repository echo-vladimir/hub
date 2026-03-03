export type RecalcFn = () => void;

export function createScheduler(debounceMs: number) {
  let t: number | null = null;
  let raf: number | null = null;

  const schedule = (fn: RecalcFn) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => {
      if (raf != null) return;
      raf = window.requestAnimationFrame(() => {
        raf = null;
        fn();
      });
    }, debounceMs);
  };

  const cancel = () => {
    if (t) {
      window.clearTimeout(t);
      t = null;
    }
    if (raf != null) {
      window.cancelAnimationFrame(raf);
      raf = null;
    }
  };

  return { schedule, cancel };
}
