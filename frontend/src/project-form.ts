import { useForm } from "@mantine/form";
import h from "@macrostrat/hyper";
import { ErrorBoundary } from "@macrostrat/ui-components";
import { Box, Textarea, TextInput, Group, Button } from "@mantine/core";

export function ProjectForm() {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
  });

  return h(ErrorBoundary, [
    h(Box, { sx: { padding: "1rem" } }, [
      h("form", { onSubmit: form.onSubmit((d) => console.log(d)) }, [
        h(TextInput, {
          label: "Name",
          required: true,
          ...form.getInputProps("name"),
        }),
        h(Textarea, {
          label: "Description",
          ...form.getInputProps("description"),
        }),
        h(
          Group,
          {
            position: "right",
            mt: "md",
          },
          [h(Button, { type: "submit" }, "Submit")]
        ),
      ]),
    ]),
  ]);
}
