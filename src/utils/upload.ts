import * as FileSystem from "expo-file-system";
import { API_URL } from "@/config";

/**
 * Uploads a local file URI to the backend and returns the URL.
 * Backend should accept multipart/form-data at POST /uploads
 * and respond with { url: "https://..." }.
 */
export async function uploadFile(localUri: string): Promise<string> {
  const fileInfo = await FileSystem.getInfoAsync(localUri);
  if (!fileInfo.exists) throw new Error("File not found");

  const filename = localUri.split("/").pop() || `upload-${Date.now()}`;
  const mimeType = getMimeType(filename);

  const resp = await FileSystem.uploadAsync(`${API_URL}/uploads`, localUri, {
    httpMethod: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    fieldName: "file",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    parameters: { filename }
  });

  if (resp.status !== 200 && resp.status !== 201) {
    throw new Error(`Upload failed (${resp.status})`);
  }
  const data = JSON.parse(resp.body);
  return data.url;
}

function getMimeType(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
