import { Group, Text, useMantineTheme, MantineTheme } from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import h from "@macrostrat/hyper";

function onDrop(files: File[]) {
  console.log(files);
}

function ImageUploader() {
  return h(
    Dropzone,
    {
      accept: [MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg, MIME_TYPES.gif],
      onDrop,
    },
    (status: DropzoneStatus) => {
      return h("p", null, "Drop an image here");
    }
  );
}

function App() {
  return h("div", [h(ImageUploader)]);
}

export { App };
