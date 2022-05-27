import { Group, Text, useMantineTheme, MantineTheme } from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import h from "@macrostrat/hyper";
import { SupabaseStorageClient } from "@supabase/storage-js";

const STORAGE_URL = "http://locahost:8000/api/storage";
const SERVICE_KEY = "service"; //! service key, not anon key

const storageClient = new SupabaseStorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});

function onDrop(files: File[]) {
  const file = files[0];
  const client = storageClient.from("section_images");
  console.log(file);
  client.upload(file.name, file).then((res) => {
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
