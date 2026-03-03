import { Group } from "./components/Group";
import { Item } from "./components/Item";
import { Action } from "./components/items/Action";
import { Content } from "./components/items/Content";
import { Trigger } from "./components/items/Trigger";
import { Toolbar as ToolbarRoot } from "./components/Toolbar";

const Toolbar = Object.assign(ToolbarRoot, {
  Group,
  Item,
  Action,
  Trigger,
  Content,
});

export default Toolbar;
