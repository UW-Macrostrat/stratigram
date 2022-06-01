import { useForm } from "@mantine/form";
import h from "@macrostrat/hyper";
import { TickIcon, CrossIcon } from "evergreen-ui";
import { Group } from "@mantine/core";
import { ModelTableHeader, ModelButton } from "./header";
import { useAPIQuery, apiClient } from "../data-service";
import { useCallback, useState } from "react";

export function ModelFormFields({ form, fields }) {
  return h(
    "div",
    { style: { padding: "1rem" } },
    fields.map((d) => {
      const { component, id, label, ...rest } = d;
      return h(component, {
        label,
        ...form.getInputProps(id),
        ...rest,
      });
    })
  );
}

function isSame(a, b) {
  // A basic comparator function because the Mantine 'useForm' hook does not preserve
  // equality of top-level objects.
  for (const key of Object.keys(a)) {
    if (a[key] != b[key]) {
      return false;
    }
  }
  return true;
}

export function ModelEditor({
  initialValues,
  onSuccess,
  model,
  fields = [],
  ...rest
}) {
  // Keep initial values so we can reset them on form submit
  const form = useForm({
    initialValues,
  });

  const onSubmit = useCallback((values) => {
    apiClient
      .from(model)
      .insert([values])
      .then((res) => {
        if (res.data == null) return;
        onSuccess?.(res.data);
      });
  }, []);

  const disabled = isSame(form.values, initialValues);

  return h("form", { onSubmit: form.onSubmit(onSubmit) }, [
    h(ModelTableHeader, rest, [
      h(Group, { spacing: "xs" }, [
        //h(ModelButton, { color: "orange", rightIcon: h(CrossIcon) }, "Cancel"),
        h(
          ModelButton,
          {
            type: "submit",
            color: "green",
            rightIcon: h(TickIcon),
            disabled,
          },
          "Done"
        ),
      ]),
    ]),
    h(ModelFormFields, { form, fields }),
  ]);
}
