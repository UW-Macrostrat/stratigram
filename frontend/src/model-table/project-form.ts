import { useForm } from "@mantine/form";
import h from "@macrostrat/hyper";
import { TickIcon, CrossIcon } from "evergreen-ui";
import { Box, Textarea, TextInput, Group } from "@mantine/core";
import { ModelTableHeader, ModelButton } from "./header";

export function ModelFormFields({ form, fields }) {
  return h(
    Box,
    {
      sx: { padding: "1rem" },
    },
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

export function ModelEditor({ initialValues, onSubmit, fields = [], ...rest }) {
  const form = useForm({
    initialValues,
  });

  const disabled = isSame(form.values, initialValues);

  return h("form", { onSubmit: form.onSubmit((d) => console.log(d)) }, [
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
