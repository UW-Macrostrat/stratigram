import h from "@macrostrat/hyper";
import { useAPIQuery } from "./data-service";

function App() {
  const projects = useAPIQuery((p) => p.from("project").select("*"), []);
  console.log(projects);

  return h("div.app", [
    h("header", [h("h1", null, "Stratiform")]),
    h("div.main", [h("h2", "Projects")]),
    h("div.project-list", []),
    h("footer"),
  ]);
}

export { App };
