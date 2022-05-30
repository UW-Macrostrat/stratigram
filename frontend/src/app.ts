import h from "@macrostrat/hyper";
import { useAPIQuery } from "./data-service";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
} from "react-router-dom";

function Project({ project }) {
  return h(Link, { to: `/projects/${project.id}` }, [
    h("h3", project.name),
    h("p", project.description),
  ]);
}

function ProjectList() {
  const { data: projects } = useAPIQuery("project", (q) => q.select("*"), []);
  if (projects == null) return null;
  return h(
    "div.project-list",
    projects.map((p) => h(Project, { project: p }))
  );
}

function ProjectsListPage() {
  return h("div.project-page", [h("h2", "Projects"), h(ProjectList)]);
}

function ColumnList({ columns }) {
  if (columns == null) return null;
  return h(
    "div.column-list",
    null,
    columns.map((c) => h(Link, { to: `/column/${c.id}` }, c.name))
  );
}

function ColumnsListPage() {
  const { project_id } = useParams();
  const { data } = useAPIQuery<
    "project",
    { name: string; column: { id: number; name: string }[] }
  >("project", (q) => q.select("name, column(id, name)"), []);
  const project = data?.[0];
  if (project == null) return null;
  const { column, name } = project;

  return h("div.columns-page", [
    h("h1", project.name),
    h(ColumnList, { columns: column }),
  ]);
}

function App() {
  const { data: projects } = useAPIQuery("project", (q) => q.select("*"), []);

  return h("div.app", [
    h(Router, [
      h("header", [h("h1", null, h(Link, { to: "/" }, "Stratiform"))]),
      h(Routes, [
        h(Route, {
          path: "/projects/:project_id",
          element: h(ColumnsListPage),
        }),
        h(Route, { index: true, element: h(ProjectsListPage) }),
      ]),
      h("footer"),
    ]),
  ]);
}

export { App };
