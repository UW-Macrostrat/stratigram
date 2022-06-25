import { MIME_TYPES, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useAsyncEffect } from "@macrostrat/ui-components";
import h from "@macrostrat/hyper";
import { StorageClient, FileObject } from "@supabase/storage-js";
import { useState, createContext, useContext } from "react";
import { StorageFileApi } from "@supabase/storage-js/dist/module/lib";

const storageURL = process.env.STORAGE_URL;
const storageToken = process.env.STORAGE_TOKEN;

const storageClient = new StorageClient(storageURL, {
  //apikey: SERVICE_KEY,
  // JSON web token key
  Authorization: `Bearer ${storageToken}`,
});

export function StorageManagerProvider({
  bucketName,
  acceptedMimeTypes = IMAGE_MIME_TYPE,
  children,
}) {
  const value = useStorageCtx(bucketName, { acceptedMimeTypes });
  return h(StorageManagementContext.Provider, { value }, children);
}

type FileListData = FileObject & { publicURL: string };

interface StorageManagementOpts {
  acceptedMimeTypes: string[];
}

interface StorageManagementCtx extends StorageManagementOpts {
  bucketName: string;
  files: FileListData[];
  refresh: () => void;
  client: StorageFileApi;
}

const StorageManagementContext = createContext<StorageManagementCtx>(null);

function useFileList(client): [FileListData[], () => void] {
  const [files, setFiles] = useState<FileListData[]>([]);
  const [updateCount, setUpdateCount] = useState(0);

  const refresh = () => setUpdateCount(updateCount + 1);

  useAsyncEffect(async () => {
    let res = await client.list();
    if (res.data == null) {
      return;
    }

    let fileData: FileListData[] = [];

    for (const file of res.data) {
      const { publicURL } = client.getPublicUrl(file.name);
      fileData.push({ ...file, publicURL });
    }

    setFiles(fileData);
  }, [updateCount]);

  return [files, refresh];
}

function useStorageCtx(
  bucketName: string,
  opts: StorageManagementOpts = { acceptedMimeTypes: IMAGE_MIME_TYPE }
) {
  let client = storageClient.from(bucketName);
  const [files, refresh] = useFileList(client);
  return { bucketName, files, refresh, client, ...opts };
}

export function useStorageManager(
  bucketName?: string
): StorageManagementCtx | null {
  if (bucketName != null) {
    return useStorageCtx(bucketName);
  }
  return useContext(StorageManagementContext);
}

export { MIME_TYPES, IMAGE_MIME_TYPE };
