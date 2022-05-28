import { Group } from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import { useAsyncEffect, DeleteButton } from "@macrostrat/ui-components";
import h from "@macrostrat/hyper";
import { StorageClient, FileObject } from "@supabase/storage-js";
import { useState, createContext, useContext, useCallback } from "react";

const storageURL = process.env.STORAGE_URL;
const storageToken = process.env.STORAGE_TOKEN;

const storageClient = new StorageClient(storageURL, {
  //apikey: SERVICE_KEY,
  // JSON web token key
  Authorization: `Bearer ${storageToken}`,
});


function ImageUploader() {
  const { client, refresh, acceptedMimeTypes } = useContext(FileManagerContext);
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
    },
    (status: DropzoneStatus) => {
      return h("p", null, "Drop an image here");
    }
  );
}

type ImageData = FileObject & { publicURL: string };

function useFileList(client) {
  const [files, setFiles] = useState<ImageData[]>([]);
  const [updateCount, setUpdateCount] = useState(0);

  const refresh = () => setUpdateCount(updateCount + 1);

  useAsyncEffect(async () => {
    let res = await client.list();
    if (res.data == null) {
      return;
    }

    let fileData: ImageData[] = [];

    for (const file of res.data) {
      const { publicURL } = client.getPublicUrl(file.name);
      fileData.push({ ...file, publicURL });
    }

    setFiles(fileData);
  }, [updateCount]);
  return [files, refresh];
}

function Image({ image }) {
  const { acceptedMimeTypes } = useContext(FileManagerContext);
  if (!acceptedMimeTypes.includes(image.metadata?.mimetype)) {
    return h("p", null, "Not an image");
  }
  return h("img", { width: 200, src: image.publicURL });
}

function ImageFileManager({ image }) {
  const { client, refresh } = useContext(FileManagerContext);
  return h("div", [
    h(Image, { image }),
    h(DeleteButton, {
      itemDescription: "this photo",
      handleDelete: () => {
        client.remove([image.name]).then((res) => {
          refresh();
        });
      },
    }),
  ]);
}

function ImageList({ images }: { images: ImageData[] }) {
  if (images == null) return null;

  return h(
    Group,
    {
      direction: "row",
      justify: "center",
      align: "center",
    },
    images.map((image) => {
      return h(ImageFileManager, { image });
    })
  );
}

const FileManagerContext = createContext(null);

function ImageManager({
  bucketName = "section-3-images",
  acceptedMimeTypes = [
    MIME_TYPES.png,
    MIME_TYPES.jpeg,
    MIME_TYPES.svg,
    MIME_TYPES.gif,
  ],
}) {
  let client = storageClient.from(bucketName);
  const [images, refresh] = useFileList(client);
  return h(
    FileManagerContext.Provider,
    { value: { images, refresh, client, acceptedMimeTypes } },
    [
      h(
        Group,
        {
          spacing: "small",
          direction: "column",
          justify: "center",
          align: "center",
        },
        [h(ImageList, { images }), h(ImageUploader)]
      ),
    ]
  );
}

function App() {
  return h("div", [h(ImageManager)]);
}

export { App };
