import h from "@macrostrat/hyper";
import { Table, PlusIcon } from "evergreen-ui";
import { useLinkClickHandler, Link, Routes, Route } from "react-router-dom";
import { ModelTableHeader, ModelButton } from "./header";
import { ModelEditor } from "./project-form";

export function LinkRow(props) {
  const { to, ...rest } = props;
  const onSelect = useLinkClickHandler(to);
  return h(BasicRow, {
    isSelectable: true,
    onClick: onSelect,
    ...rest,
  });
}

export function BasicRow(props) {
  const { data, children = null, ...rest } = props;
  return h(Table.Row, rest, [
    h(Table.TextCell, {}, data.name ?? data.title),
    children,
  ]);
}

function ModelTableBody({ data, title, rowComponent = BasicRow, model }) {
  return h(
    Table.Body,
    null,
    data.map((row) => h(rowComponent, { data: row }))
  );
}

function ModelRoot({ ...props }) {
  const { title, rootRoute, headerChildren = null, ...rest } = props;
  return h([
    h(ModelTableHeader, { title, rootRoute }, [
      h(
        ModelButton,
        {
          component: Link,
          to: "new",
          rightIcon: h(PlusIcon),
        },
        "New"
      ),
    ]),
    h(ModelTableBody, rest),
  ]);
}

export function ModelTable(props) {
  const { title, headerChildren = null, ...rest } = props;
  return h(Table, { border: true }, [
    h(ModelTableHeader, { title }, headerChildren),
    h(ModelTableBody, rest),
  ]);
}

export function ModelManagementPage(props) {
  const {
    rootRoute = "/projects",
    title,
    editorFields,
    initialValues,
    ...rest
  } = props;
  return h(Table, { border: true }, [
    h(Routes, [
      h(Route, {
        path: "/",
        element: h(ModelRoot, { rootRoute, title, ...rest }),
      }),
      h(Route, {
        path: "/new",
        element: h(ModelEditor, {
          rootRoute,
          title,
          fields: editorFields,
          initialValues,
          ...rest,
        }),
      }),
    ]),
  ]);
}

export { ModelButton };
