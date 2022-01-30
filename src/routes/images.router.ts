import { Request, Response } from "express";
import { Canvas, registerFont, resolveImage } from "canvas-constructor/cairo";
import axios from "axios";
import { loadAssetLazyAsync } from "../asset-map";

registerFont("./assets/fonts/Felt Regular.ttf", { family: "Felt" });
registerFont("./assets/fonts/Little Days.ttf", {
  family: "Little Days Alt",
});

function wordWrap(str: string, maxWidth: number) {
  let newLineStr = "\n";
  let done = false;
  let res = "";
  do {
    let found = false;
    // Inserts new line at first whitespace of the line
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join("");
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }

    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join("");
      str = str.slice(maxWidth);
    }

    if (str.length < maxWidth) done = true;
  } while (!done);

  return res + str;
}

function testWhite(x: string) {
  var white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
}

export const box = async (req: Request, res: Response) => {
  try {
    const url: string = req.query.url;
    let text = req.query.text;
    let wrappedText = wordWrap(text, 15);

    // AvatarCanvas for manipulation (Probably a better way to do this)
    // @ts-ignore
    let avatarCanvas = new Canvas(256, 256, "png");

    // @ts-ignore
    const canvas = new Canvas(600, 399, "png"); // Base Canvas
    // AvatarImage Grab
    let avImage = await axios.get(url, { responseType: "arraybuffer" });
    // Load Image into Cache if not Loaded
    let box = await resolveImage(await loadAssetLazyAsync("assets/box.png"));

    // Avatar Rotate 22, Grab center of Canvas for Rotation, "Rotate" around that point,
    // then move Image to center
    const avatar = await resolveImage(
      await avatarCanvas
        .translate(128, 128)
        .rotate((22 * Math.PI) / 180)
        .translate(-128, -128)
        .printImage(avImage.data, 0, 0, 256, 256)
        .toBufferAsync()
    );

    // Add Rotated Avatar to canvas, add box, add centered wrapped text.
    canvas
      .printImage(avatar, 378, 132, 200, 200)
      .printImage(box, 0, 0)
      .setTextFont("24px Felt")
      .setTextAlign("center")
      .printMultilineText(wrappedText, 95, 275);

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } catch (error) {
    res.json({ status: 500, message: error.toString() });
  }
};

export const yugioh = async (req: Request, res: Response) => {
  try {
    let url = req.query.url;
    // @ts-ignore
    let avatarCanvas = new Canvas(265, 265, "png");
    // @ts-ignore
    let canvas = new Canvas(480, 768, "png");
    let avImage = await axios.get(url, { responseType: "arraybuffer" });
    let cardImg = await resolveImage(
      await loadAssetLazyAsync("./assets/heartofthecard.png")
    );

    // Same Concept original comments in Box function
    const avatar = await resolveImage(
      await avatarCanvas
        .translate(128, 128)
        .rotate((-10 * Math.PI) / 180)
        .translate(-128, -128)
        .printImage(avImage.data, 0, 0, 256, 256)
        .toBufferAsync()
    );

    canvas.printImage(avatar, 26, 0, 265, 265).printImage(cardImg, 0, 0);

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } catch (error) {
    res.json({ status: 500, message: error.toString() });
  }
};

export const disability = async (req: Request, res: Response) => {
  try {
    let url = req.query.url;
    // @ts-ignore
    let canvas = new Canvas(467, 397, "png");
    let avImage = await axios.get(url, { responseType: "arraybuffer" });
    let disabilityImg = await resolveImage(
      await loadAssetLazyAsync("./assets/disability.png")
    );

    // No need for Avatar Manipulation, resize and place
    canvas
      .printImage(avImage.data, 320, 159, 126, 126)
      .printImage(disabilityImg, 0, 0);

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } catch (error) {
    res.json({ status: 500, message: error.toString() });
  }
};

export const tohru = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    let text = req.query.text;
    let wrappedText = wordWrap(text, 8);

    // @ts-ignore
    let canvas = new Canvas(505, 560, "png");
    let tohruImg = await resolveImage(
      await loadAssetLazyAsync("./assets/tohru.png")
    );

    // Create white rectangle, fill whole canvas, add image rotate text and place.
    canvas
      .setColor("white")
      .printRectangle(0, 0, 505, 560)
      .printImage(tohruImg, 0, 0)
      .rotate((-5 * Math.PI) / 180)
      .setTextAlign("center")
      .setColor("black")
      .setTextFont("48px Little Days Alt")
      .printMultilineText(wrappedText, 300, 280);

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } catch (error) {
    res.json({ status: 500, message: error.toString() });
  }
};

export const yagami = async (req: Request, res: Response) => {
  try {
    let text = req.query.text;
    let wrappedText = wordWrap(text, 15);

    // @ts-ignore
    let canvas = new Canvas(529, 389, "png");
    let yagamiImg = await resolveImage(
      await loadAssetLazyAsync("./assets/source-image.png")
    );

    canvas
      .printImage(yagamiImg, 0, 0)
      .setTextFont("32px Little Days Alt")
      .printText(wrappedText, 10, 200);

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } catch (error) {
    res.json({ status: 500, message: error.toString() });
  }
};
