import h from "@macrostrat/hyper";
import { Table } from "evergreen-ui";
import { Link } from "react-router-dom";

export function LinkRow(props) {
  const { to, ...rest } = props;
  const children = h(BasicRow, rest);
  if (to == null) return children;
  return h(Link, { to, children });
}

export function BasicRow(props) {
  const { data, children = null } = props;
  return h(Table.Row, props, [
    h(Table.TextCell, {}, data.name ?? data.title),
    children,
  ]);
}

export function ModelTable({ data, title, rowComponent = BasicRow }) {
  return h(Table, { border: true }, [
    h(Table.Head, [h(Table.TextHeaderCell, {}, title)]),
    h(
      Table.Body,
      null,
      data.map((row) => h(rowComponent, { data: row }))
    ),
  ]);
}
