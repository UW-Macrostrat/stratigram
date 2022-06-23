import h from "@macrostrat/hyper";
import { App } from "~/legacy-ui/app";
import { StorageUI, WidePage } from "~/components";

export function ColumnPage(props) {
  return h(WidePage, { className: "column-page" }, [h(App), h(StorageUI, {})]); //, //h(App)]);
}
