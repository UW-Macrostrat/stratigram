import h from "@macrostrat/hyper";
import { App } from "~/legacy-ui/app";
import { StorageUI, WidePage } from "~/components";
import { Link, useParams, Route, Routes } from "react-router-dom";
import { useAPIQuery } from "~/data-service";

export function ColumnPage(props) {
  const { column_id } = useParams();

  const { data, loading } = useAPIQuery(
    "column",
    (q) =>
      q.select("id, name, project(id, name)").filter("id", "eq", column_id),
    []
  );

  const { project, id } = data?.[0];

  console.log(data);

  const sidebarContent = h("div.link-list", [
    h(Link, { to: `/project/${column_id}` }, "Projects"),
  ]);

  return h(WidePage, { className: "column-page", sidebarContent }, [
    h(Routes, [
      h(Route, { path: "/images", element: h(ColumnImagesUI, { column_id }) }),
      h(Route, { path: "/", element: h(App), exact: true }),
    ]),
  ]); //, //h(App)]);
}

function ColumnImagesUI({ column_id }) {
  return h(StorageUI, { bucketName: `column-${column_id}-images` });
}

function ProjectLink({ data }) {
  const { id, name } = data;
  return h(Link, { to: `/project/${id}` });
}
