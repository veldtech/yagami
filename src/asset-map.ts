import { promises as fs } from "fs";

const assetDict = new Map<string, Buffer>();

export async function loadAssetLazyAsync(uri: string): Promise<Buffer> {
  if (assetDict.has(uri)) {
    return assetDict.get(uri);
  }

  let buffer = await fs.readFile(uri);
  assetDict.set(uri, buffer);
  return buffer;
}
