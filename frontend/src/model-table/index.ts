import h from "@macrostrat/hyper";
import Box from "ui-box";
import { Table, PlusIcon } from "evergreen-ui";
import { Button, Text } from "@mantine/core";
import {
  useLinkClickHandler,
  Link,
  Routes,
  Route,
  useMatch,
} from "react-router-dom";
import { Breadcrumbs, Anchor } from "@mantine/core";
import { ProjectForm } from "../project-form";
import { ReactElement } from "react";
import { hideHotkeysDialog } from "@blueprintjs/core";

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

const items = [
  { title: "Projects", href: "#" },
  { title: "New", href: "#" },
].map((item, index) =>
  h(Text, { size: "sm", to: item.href, key: index }, item.title)
);

const BreadcrumbText = (props) => h(Text, { size: "sm", ...props });

function ModelTableBreadcrumbs({ title, rootRoute, items = [] }) {
  const titleText = h(BreadcrumbText, {}, title);
  let children = [titleText];
  if (items.length > 0) {
    children = [h(Link, { to: rootRoute }, titleText), ...items];
  }
  return h(Breadcrumbs, { separator: "/" }, children);
}

function ModelTableBody({
  data,
  title,
  rootRoute = "/projects",
  rowComponent = BasicRow,
  model,
}) {
  return h(
    Table.Body,
    null,
    data.map((row) => h(rowComponent, { data: row }))
  );
}

function ModelTableHeader(props) {
  const { title, rootRoute } = props;
  const onNewPage = useMatch(rootRoute + "/new");
  let items: any[] = [];
  if (onNewPage) {
    items.push(h("div", null, h(BreadcrumbText, null, "New")));
  }

  return h(Table.Head, [
    h(Table.HeaderCell, { justifyContent: "flex-end" }, [
      h(
        Box,
        { flexGrow: 1 },
        h(ModelTableBreadcrumbs, { title, rootRoute, items })
      ),
      h.if(!onNewPage)(
        Button,
        {
          component: Link,
          size: "sm",
          to: "new",
          variant: "outline",
          color: "violet",
          rightIcon: h(PlusIcon),
        },
        "New"
      ),
    ]),
  ]);
}

export function ModelTable(props) {
  const { rootRoute = "/projects", title, ...rest } = props;
  return h(Table, { border: true }, [
    h(ModelTableHeader, { title, rootRoute }),
    h(Routes, [
      h(Route, {
        path: "/",
        element: h(ModelTableBody, { rootRoute, ...rest }),
      }),
      h(Route, {
        path: "/new",
        element: h(ProjectForm),
      }),
    ]),
  ]);
}
