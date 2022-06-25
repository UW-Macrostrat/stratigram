import h from "@macrostrat/hyper";
import { ColumnView } from "~/components/column-view";
import { StorageUI, WidePage, LabeledValue } from "~/components";
import { Link, useParams, Route, Routes } from "react-router-dom";
import { useAPIQuery } from "~/system/data-service";
import { SidebarButton } from "~/components/buttons";

export function ColumnPage(props) {
  const { column_id } = useParams();

  const { data, loading } = useAPIQuery(
    "column",
    (q) =>
      q.select("id, name, project(id, name)").filter("id", "eq", column_id),
    []
  );

  const datum = data?.[0];

  if (datum == null) {
    return null;
  }

  const { project, id, name } = datum;

  const sidebarContent = h([
    h("div.main-info", [
      h("h2.subtitle", name),
      h(ProjectLink, { data: project }),
    ]),
    h("div.column-links", [
      h(SidebarButton, { to: `/columns/${id}`, icon: "edit" }, "Edit"),
      h(
        SidebarButton,
        {
          to: `settings`,
          icon: "settings",
        },
        "Settings"
      ),
      h(
        SidebarButton,
        {
          to: `images`,
          icon: "media",
        },
        "Images"
      ),
    ]),
  ]);

  return h(WidePage, { className: "column-page", sidebarContent }, [
    h(Routes, [
      h(Route, {
        path: "/images",
        element: h(ColumnImagesUI, { column_id }),
      }),
      h(Route, {
        path: "/",
        element: h(ColumnView, { column_id }),
        exact: true,
      }),
    ]),
  ]); //, //h(App)]);
}

function ColumnImagesUI({ column_id }) {
  return h(StorageUI, { bucketName: `column-${column_id}-images` });
}

function ProjectLink({ data }) {
  const { id, name } = data;
  return h(
    Link,
    { to: `/project/${id}` },
    h(LabeledValue, { label: "Project" }, name)
  );
}
