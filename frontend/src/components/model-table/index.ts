import h from "~/hyper";
import { Table, PlusIcon, Spinner } from "evergreen-ui";
import {
  useLinkClickHandler,
  Link,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { DeleteButton } from "@macrostrat/ui-components";
import { ModelTableHeader, ModelButton } from "./header";
import { ModelEditor, ModelEditOperation } from "./edit-form";
import { useAPIQuery } from "../../data-service";
import { FocusPage } from "~/components/page-layouts";
import {
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
} from "@supabase/postgrest-js";

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

function ModelTableBody({
  data,
  loading = false,
  rowComponent = BasicRow,
  onDelete = console.log,
}) {
  if (loading) {
    return h(Table.Body, [h(Spinner)]);
  }
  if (data == null) {
    return null;
  }

  return h(
    Table.Body,
    null,
    data.map((row) =>
      h(rowComponent, { data: row }, [
        h("div.row-actions", [
          h(DeleteButton, {
            minimal: true,
            large: true,
            handleDelete: () => onDelete(row),
          }),
        ]),
      ])
    )
  );
}

function ModelRoot({
  title,
  rootRoute,
  model,
  selector = (q) => q.select("*"),
  headerChildren = null,
  loading = false,
  data,
  ...rest
}) {
  // Get data from the model API if not provided up-front
  if (data == null) {
    const { data: dataFromAPI, loading: apiLoading } = useAPIQuery(
      model,
      selector,
      []
    );
    data = dataFromAPI;
    loading = apiLoading;
  }

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
    h(ModelTableBody, { data, loading, ...rest }),
  ]);
}

export function ModelTable(props) {
  const { title, headerChildren = null, ...rest } = props;
  return h(Table, { border: true }, [
    h(ModelTableHeader, { title }, headerChildren),
    h(ModelTableBody, rest),
  ]);
}

interface ModelManagementProps<T extends string = string, D = any> {
  title: string;
  model: T;
  rootRoute: string;
  editorFields: React.ReactNode[];
  initialValues: { [key: string]: any };
  rowComponent?: React.ComponentType<{ data: D }>;
  data?: D[];
  selector?: (q: PostgrestQueryBuilder<D>) => PostgrestFilterBuilder<D>;
  onUpdate?(operation: ModelEditOperation, data?: D[]);
}

export function ModelManagementPage(props: ModelManagementProps<string, any>) {
  return h(FocusPage, null, h(ModelManagementInterface, props));
}

export function ModelManagementInterface(
  props: ModelManagementProps<string, any>
) {
  const {
    rootRoute = "/",
    title,
    model,
    editorFields,
    initialValues,
    onUpdate,
    ...rest
  } = props;

  const nav = useNavigate();

  return h(Table, { border: true }, [
    h(Routes, [
      h(Route, {
        path: "/",
        element: h(ModelRoot, { rootRoute, title, model, ...rest }),
      }),
      h(Route, {
        path: "/new",
        element: h(ModelEditor, {
          operation: ModelEditOperation.Insert,
          rootRoute,
          title,
          model,
          fields: editorFields,
          initialValues,
          onSuccess(op, data) {
            onUpdate(op, data);
            nav(rootRoute + "/");
          },
          ...rest,
        }),
      }),
    ]),
  ]);
}

export { ModelButton };
