import h from "@macrostrat/hyper";
import Box from "ui-box";
import { Table } from "evergreen-ui";
import { Text, Button } from "@mantine/core";
import { Link, useMatch } from "react-router-dom";
import { Breadcrumbs } from "@mantine/core";

const BreadcrumbText = (props) => h(Text, { size: "sm", ...props });

function ModelTableBreadcrumbs({ title, rootRoute, items = [] }) {
  const titleText = h(BreadcrumbText, {}, title);
  let children = [titleText];
  if (items.length > 0) {
    children = [h(Link, { to: rootRoute }, titleText), ...items];
  }
  return h(Breadcrumbs, { separator: "/" }, children);
}

export function ModelButton(props) {
  return h(Button, {
    size: "sm",
    variant: "outline",
    color: "violet",
    ...props,
  });
}

export function ModelTableHeader(props) {
  const { title, rootRoute, children } = props;
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
      children,
    ]),
  ]);
}
