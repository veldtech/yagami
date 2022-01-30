import { promises as fs } from "fs";

const assetDict = new Map<string, Buffer>();

export const loadAssetLazyAsync = async (uri: string) => {
  if (assetDict.has(uri)) {
    return assetDict.get(uri);
  }

  let buffer = await fs.readFile(uri);
  assetDict.set(uri, buffer);
  return buffer;
};
