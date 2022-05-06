import "@blueprintjs/core/lib/css/blueprint.css";
import { render } from "react-dom";
import { FocusStyleManager } from "@blueprintjs/core";
import h from "@macrostrat/hyper";

FocusStyleManager.onlyShowFocusOnTabs();

const el = document.createElement("div");
el.className = "app";
// Render the application
console.log("Rendering");

document.body.appendChild(el);

render(h("div", null, ["Hello, world!"]), el);
