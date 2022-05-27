import { Group, Text, useMantineTheme, MantineTheme } from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import h from "@macrostrat/hyper";
import { StorageClient } from "@supabase/storage-js";

const storageClient = new StorageClient(process.env.STORAGE_URL, {
  //apikey: SERVICE_KEY,
  // JSON web token key
  Authorization: `Bearer ${process.env.STORAGE_TOKEN}`,
});

function onDrop(files: File[]) {
  const file = files[0];
  const client = storageClient.from("section_images");
  console.log(file);
  client
    .upload(file.name, file, {
      upsert: true,
    })
    .then((res) => {
      console.log(res);
    });
}

function ImageUploader() {
  return h(
    Dropzone,
    {
      accept: [MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg, MIME_TYPES.gif],
      onDrop,
      multiple: false,
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
