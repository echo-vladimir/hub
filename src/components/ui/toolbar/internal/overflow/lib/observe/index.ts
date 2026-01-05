import {
  createLayoutObserver,
  type LayoutObserverApi,
} from "./layout-observer";

let _layout: LayoutObserverApi | null = null;
function getLayoutObserver(opts?: { debug?: boolean }) {
  if (!_layout) _layout = createLayoutObserver(opts);
  return _layout;
}

export { type LayoutObserverApi, getLayoutObserver };
