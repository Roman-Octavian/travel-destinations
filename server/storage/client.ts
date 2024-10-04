import { BlobDeleteResponse, BlobServiceClient, type ContainerClient } from '@azure/storage-blob';
import path from 'path';
import { nanoid } from 'nanoid';

const { BLOB_STORAGE_CONNECTION_STRING } = process.env;

if (BLOB_STORAGE_CONNECTION_STRING == null) {
  throw new Error('Blob Storage connection string is not defined');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(BLOB_STORAGE_CONNECTION_STRING);

/**
 * Gets an existing container within the Azure Blob Storage Account resource
 *
 * To keep school project contained this is limited to just one container
 *
 * Server-side only
 * @returns Container client if successful, null if error
 */
async function getContainerClient(): Promise<ContainerClient | null> {
  try {
    const containerClient = blobServiceClient.getContainerClient('container');

    if (await containerClient.exists()) {
      return containerClient;
    }

    console.error('Container not found');
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Upload a blob to the Azure Storage Account container
 *
 * Will handle name collisions gracefully
 *
 * Server-side only
 * @param obj.blob item to upload in the form of a NodeJS "Blob"
 * @param obj.blobName the name of the file being uploaded
 * @returns a public URL pointing to the upload or null in case of failure
 */
export async function createBlob({
  blob,
  blobName,
}: {
  blob: Blob;
  blobName: string;
}): Promise<string | null> {
  try {
    const containerClient = await getContainerClient();
    if (containerClient == null) {
      console.error(`Container not found`);
      return null;
    }

    let uniqueName = blobName;
    // Azure overwrites blobs with the same name. To prevent data loss, loop until safe name is found
    while (true) {
      let blockBlobClient = containerClient.getBlockBlobClient(uniqueName);
      if (await blockBlobClient.exists()) {
        uniqueName = `${path.parse(uniqueName).name}_${nanoid(4)}${path.parse(uniqueName).ext}`;
      } else {
        const upload = await blockBlobClient.upload(
          Buffer.from(await blob.arrayBuffer()),
          blob.size,
        );
        if (upload.etag !== null) {
          return blockBlobClient.url;
        } else {
          console.error(`Upload failed: ${upload}`);
          return null;
        }
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Delete a blob from the Azure Storage Account container
 *
 * For the purpose of this project no soft-deletion is handled
 *
 * Server-side only
 * @param blobName Name of the blob to be deleted
 * @returns a BlobDeleteResponse or null in case of hard failure
 */
export async function deleteBlob(blobName: string): Promise<BlobDeleteResponse | null> {
  try {
    const containerClient = await getContainerClient();
    if (containerClient == null) {
      console.error(`Container not found`);
      return null;
    }
    return await containerClient.deleteBlob(blobName);
  } catch (error) {
    console.error(error);
    return null;
  }
}
