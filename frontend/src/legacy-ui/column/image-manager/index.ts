import { Dropzone, DropzoneStatus } from "@mantine/dropzone";
import h from "./main.styl";
import { useCallback } from "react";
import { ModelTable } from "../../../components/model-table";
import { Table } from "evergreen-ui";
import { StorageManagerProvider, useStorageManager } from "~/system/storage";

function ImageUploader({ className = null }) {
  const { client, refresh, acceptedMimeTypes } = useStorageManager();
  const onDrop = useCallback(
    (files) => {
      const file = files[0];
      client
        .upload(file.name, file, {
          upsert: true,
        })
        .then((res) => {
          refresh();
        });
    },
    [client]
  );

  return h(
    Dropzone,
    {
      accept: acceptedMimeTypes,
      onDrop,
      multiple: false,
      className,
    },
    (status: DropzoneStatus) => {
      return h("div.file-picker-status", [
        h("p", null, "Drop an image here"),
        h("p.subtext", null, "(or click to select a file)"),
      ]);
    }
  );
}

function Image({ image }) {
  const { acceptedMimeTypes } = useStorageManager();
  if (!acceptedMimeTypes.includes(image.metadata?.mimetype)) {
    return h("p", null, "Not an image");
  }
  return h("img", { src: image.publicURL });
}

function ImageFileRow({ data, children }) {
  return h(
    Table.Row,
    {
      className: "image-file-row",
    },
    [
      h(Table.TextCell, {}, data.name),
      h(Table.Cell, h(Image, { image: data })),
      children,
    ]
  );
}

function ImageList() {
  const { files: images } = useStorageManager();
  if (images == null) return null;

  return h(ModelTable, {
    data: images,
    rowComponent: ImageFileRow,
    title: "Images",
  });
}

export function StorageUI({ bucketName }) {
  return h(StorageManagerProvider, { bucketName }, [
    h("h1", "Column images"),
    h("div.main-content", [
      h(ImageUploader, { className: "image-dropzone" }),
      h(ImageList),
    ]),
  ]);
}
