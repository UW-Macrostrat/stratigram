import { Group, Text, useMantineTheme, MantineTheme } from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import h from "@macrostrat/hyper";
import { StorageClient } from "@supabase/storage-js";
import { useState, useEffect } from "react";

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

function useFileList() {
  const [files, setFiles] = useState<File[]>();
  useEffect(() => {
    storageClient
      .from("section_images")
      .list()
      .then((res) => {
        console.log(res);
        setFiles(res);
      });
  }, []);
  return files;
}

function ImageManager() {
  const img = useFileList();
  return h(
    Group,
    {
      spacing: "small",
      direction: "column",
      justify: "center",
      align: "center",
    },
    [h("img", { src: "https://picsum.photos/200" }), h(ImageUploader)]
  );
}

function App() {
  return h("div", [h(ImageManager)]);
}

export { App };
