import h from "@macrostrat/hyper";
import { App } from "~/legacy-ui/app";
import { StorageUI } from "~/components";

export function ColumnPage(props) {
  return h("div.column-page", [h(StorageUI, {})]); //, //h(App)]);
}
