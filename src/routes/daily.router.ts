import { Canvas, resolveImage } from "canvas-constructor/skia";
import { loadAssetLazyAsync } from "../asset-map";
import { Request, Response, NextFunction } from "express";

export const daily = async (req: Request, res: Response, next: NextFunction) => {
  const index = Number(req.query.index) || 0;

  const dailyCard = await loadAssetLazyAsync("./assets/daily.png");
  const dailyOverlay = await loadAssetLazyAsync("./assets/daily-overlay.png");

  const cardImage = await resolveImage(dailyCard);
  const overlayImage = await resolveImage(dailyOverlay);

  const overlayX = 99 + (304 * index);
  const overlayY = 65;

  const canvas = new Canvas(1693, 410)
    // Print background
    .printImage(cardImage, 0, 0, 1693, 410)
    .printImage(overlayImage, overlayX, overlayY, 280, 280);

  res.set("Content-Type", "image/png");
  return res.status(200).end(await canvas.toBuffer("png"));
};
