import {
  DefaultAzureCredential,
  InteractiveBrowserCredential,
} from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

const uploadFile = async (filePath: string, fileName: string) => {
  // process.env.REACT_APP_STORAGE

  const blobServiceClient = new BlobServiceClient(
    process.env.REACT_APP_STORAGE!,
    new DefaultAzureCredential()
  );

  const containerClient = blobServiceClient.getContainerClient("quotes");

  const blockBlobClient = await containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadFile(filePath);
};

export const downloadFile = async () => {
  const blobServiceClient = new BlobServiceClient(
    process.env.REACT_APP_STORAGE!,
    new InteractiveBrowserCredential()
  );

  const containerClient = blobServiceClient.getContainerClient("quotes");

  const blockBlobClient = await containerClient.getBlockBlobClient(
    "delllaptop.jpeg"
  );

  const downloadBlockBlobResponse = await blockBlobClient.download(0);
};
