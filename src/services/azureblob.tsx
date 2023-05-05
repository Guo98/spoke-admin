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
    new InteractiveBrowserCredential({
      tenantId: "b0b48379-c90e-4c9d-b29a-9ac95ef4b3a7",
      clientId: "bfcd6a7e-5e8c-4f98-b9da-013af0c31695",
    })
  );

  const containerClient = blobServiceClient.getContainerClient("quotes");

  const blockBlobClient = await containerClient.getBlockBlobClient(
    "delllaptop.jpeg"
  );

  const downloadBlockBlobResponse = await blockBlobClient.download(0);
};
