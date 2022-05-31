import h from "@macrostrat/hyper";
import { useAPIQuery } from "./data-service";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
} from "react-router-dom";
import ExampleUsersTable from "./model-table/fancy-example";
import { ModelTable, LinkRow } from "./model-table";
import { Box } from "@mantine/core";
import { Button } from "@mantine/core";

function ProjectRow({ data }) {
  return h(LinkRow, { to: `/project/${data.id}`, data });
}

function ProjectList() {
  const { data: projects } = useAPIQuery("project", (q) => q.select("*"), []);
  if (projects == null) return null;
  return h(ModelTable, {
    data: projects,
    model: "project",
    title: "Projects",
    rowComponent: ProjectRow,
  });
}

function ProjectsListPage() {
  return h("div.project-page", [h(ProjectList)]);
}

function ColumnRow({ data }) {
  return h(LinkRow, {
    to: `/columns/${data.id}`,
    data,
  });
}

type ColumnListData = { name: string; column: { id: number; name: string }[] };

function ColumnsListPage() {
  const { project_id } = useParams();
  const { data } = useAPIQuery<"project", ColumnListData>(
    "project",
    (q) => q.select("name, column(id, name)"),
    []
  );
  const project = data?.[0];
  if (project == null) return null;
  const { column, name } = project;

  return h("div.columns-page", [
    h("h1", name),
    h(ModelTable, { data: column, title: "Columns", rowComponent: ColumnRow }),
    h("p", null, h(Link, { to: "users" }, "Manage project users")),
  ]);
}

function ManageUsersPage() {
  // A placeholder for future functionality
  return h(ExampleUsersTable);
}

function ColumnPage() {
  return h("div.column-page", [h("h1", "Column")]);
}

function IntroPage() {
  return h("div.intro-page", [
    h("p", "Stratiform helps capture stratigraphic columns"),
    h(
      Button,
      { component: Link, to: "/projects", variant: "outline", color: "violet" },
      "Projects"
    ),
  ]);
}

function App() {
  const { data: projects } = useAPIQuery("project", (q) => q.select("*"), []);

  return h("div.app", [
    h(Box, { padding: "xlarge", sx: { maxWidth: 600 }, mx: "auto" }, [
      h(Router, [
        h("header", [h("h1", null, h(Link, { to: "/" }, "Stratiform"))]),
        h(Routes, [
          h(Route, {
            path: "/projects*",
            element: h(ProjectsListPage),
          }),
          h(Route, {
            path: "/project/:project_id",
            element: h(ColumnsListPage),
          }),
          h(Route, {
            path: "/projects/:project_id/users",
            element: h(ManageUsersPage),
          }),
          h(Route, { path: "/columns/:column_id", element: h(ColumnPage) }),
          h(Route, { index: true, element: h(IntroPage) }),
        ]),
        h("footer"),
      ]),
    ]),
  ]);
}

export { App };
