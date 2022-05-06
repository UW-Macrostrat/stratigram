import { FocusStyleManager } from "@blueprintjs/core";
import { render } from "react-dom";
import h from "@macrostrat/hyper";

import "@blueprintjs/core/lib/css/blueprint.css";

FocusStyleManager.onlyShowFocusOnTabs();

const el = document.createElement("div");
el.className = "app";
// Render the application
document.body.appendChild(el);
render(h("div", null, ["Hello, world!"]), el);
