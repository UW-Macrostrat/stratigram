import h from "@macrostrat/hyper";
import { useAPIQuery } from "./data-service";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
} from "react-router-dom";
import ExampleUsersTable from "./experiments/fancy-example";
import {
  ModelTable,
  LinkRow,
  ModelManagementPage,
  ModelButton,
} from "./model-table";
import { Box } from "@mantine/core";
import { TextInput, Textarea } from "@mantine/core";
import { ArrowRightIcon } from "evergreen-ui";
import { ColumnPage } from "./pages";
//import AboutText from "./about.mdx";

function ProjectRow({ data, children }) {
  return h(LinkRow, { to: `/project/${data.id}`, data, children });
}

const baseEditorFields = [
  { label: "Name", id: "name", component: TextInput, required: true },
  { label: "Description", id: "description", component: Textarea },
];

function ProjectManagementPage() {
  return h(ModelManagementPage, {
    model: "project",
    title: "Projects",
    rootRoute: "/projects",
    rowComponent: ProjectRow,
    editorFields: [...baseEditorFields],
    initialValues: {
      name: "",
      description: "",
    },
  });
}

function ColumnRow({ data, children }) {
  return h(LinkRow, {
    to: `/columns/${data.id}`,
    data,
    children,
  });
}

type ColumnListData = { name: string; column: { id: number; name: string }[] };

function ColumnsListPage() {
  const { project_id } = useParams();
  const { data, refresh } = useAPIQuery<"project", ColumnListData>(
    "project",
    (q) => q.select("name, column(id, name)"),
    []
  );
  const project = data?.[0];
  if (project == null) return null;
  const { column, name } = project;

  return h("div.columns-page", [
    h("h1", name),
    h(ModelManagementPage, {
      title: "Columns",
      rowComponent: ColumnRow,
      model: "column",
      rootRoute: `/project/${project_id}`,
      editorFields: [...baseEditorFields],
      initialValues: {
        name: "",
        description: "",
        project_id,
      },
      onUpdate() {
        refresh();
      },
    }),
    //h("p", null, h(Link, { to: "users" }, "Manage project users")),
  ]);
}

function ManageUsersPage() {
  // A placeholder for future functionality
  return h(ExampleUsersTable);
}

function ProjectTable(props) {
  const { data: projects } = useAPIQuery("project", (q) => q.select("*"), []);
  if (projects == null) return null;
  return h(ModelTable, {
    data: projects,
    model: "project",
    title: "Projects",
    rowComponent: ProjectRow,
    headerChildren: [
      h(
        ModelButton,
        {
          component: Link,
          to: "projects",
          rightIcon: h(ArrowRightIcon),
        },
        "Manage"
      ),
    ],
  });
}

function IntroPage() {
  return h("div.intro-page", [h(ProjectTable)]);
}

function App() {
  const { data: projects } = useAPIQuery("project", (q) => q.select("*"), []);

  return h("div.app", [
    h(Box, { padding: "xlarge", sx: { maxWidth: 600 }, mx: "auto" }, [
      h(Router, [
        h("header", [h("h1", null, h(Link, { to: "/" }, "Stratigram"))]),
        h(Routes, [
          h(Route, {
            path: "/projects*",
            element: h(ProjectManagementPage),
          }),
          h(Route, {
            path: "/project/:project_id/*",
            element: h(ColumnsListPage),
          }),
          h(Route, {
            path: "/project/:project_id/users",
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
