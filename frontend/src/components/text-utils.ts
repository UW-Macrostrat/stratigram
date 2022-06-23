import h from "@macrostrat/hyper";

export function LabeledValue({ label, children }) {
  return h("span.labeled-value", [
    h("span.label", label),
    h("span.value", children),
  ]);
}
