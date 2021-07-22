import { Request, Response } from "express";
import { Canvas } from "canvas-constructor";
import axios from "axios";
import {loadAssetLazyAsync} from "../asset-map";


Canvas.registerFont("./assets/fonts/Felt Regular.ttf", {family: "Felt"});
Canvas.registerFont("./assets/fonts/Little Days.ttf", {family: "Little Days Alt"});

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

    // @ts-ignore
    let avatarCanvas = new Canvas(256, 256, "png") // AvatarCanvas for manipulation (Probably a better way to do this)
    // @ts-ignore
    let canvas = new Canvas(600, 399, "png") // Base Canvas
    let avImage = await axios.get(url, {responseType: "arraybuffer"}) // AvatarImage Grab
    let box = await loadAssetLazyAsync("assets/box.png"); // Load Image into Cache if not Loaded

    // Avatar Rotate 22, Grab center of Canvas for Rotation, "Rotate" around that point, then move Image to center
    avatarCanvas
        .translate( 128, 128 )
        .rotate(22 * Math.PI / 180)
        .translate( -128, -128)
        .addImage(avImage.data, 0, 0, 256, 256);

    // Add Rotated Avatar to canvas, add box, add centered wrapped text.
    canvas
        .addImage(avatarCanvas.toBuffer(), 378, 132, 200,200)
        .addImage(box, 0, 0)
        .setTextFont('24px Felt')
        .setTextAlign('center')
        .addMultilineText(wrappedText, 95, 275);

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());

  } catch (error) {
    res.json({status: 500, message: error.toString() });
  }
};

export const yugioh = async (req: Request, res: Response) => {
  try {
    let url = req.query.url;
    // @ts-ignore
    let avatarCanvas = new Canvas(265, 265, "png");
    // @ts-ignore
    let canvas = new Canvas(480, 768, "png");
    let avImage = await axios.get(url, {responseType: "arraybuffer"});
    let cardImg = await loadAssetLazyAsync("./assets/heartofthecard.png");

    // Same Concept original comments in Box function
    avatarCanvas
        .translate( 128, 128 )
        .rotate(-10 * Math.PI / 180)
        .translate( -128, -128)
        .addImage(avImage.data, 0, 0, 256, 256);

    canvas
        .addImage(avatarCanvas.toBuffer(), 26, 0, 265,265)
        .addImage(cardImg, 0, 0)

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());

  } catch (error) {
    res.json({status: 500, message: error.toString() });
  }
};

export const disability = async (req: Request, res: Response) => {
  try {
    let url = req.query.url;
    // @ts-ignore
    let canvas = new Canvas(467, 397, "png");
    let avImage = await axios.get(url, {responseType: "arraybuffer"});
    let disabilityImg = await loadAssetLazyAsync("./assets/disability.png");

    // No need for Avatar Manipulation, resize and place
    canvas
        .addImage(avImage.data, 320, 159, 126,126)
        .addImage(disabilityImg, 0, 0)

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());

  } catch (error) {
    res.json({status: 500, message: error.toString() });
  }
};

export const tohru = async (req: Request, res: Response) => {
  try {

    // @ts-ignore
    let text = req.query.text;
    let wrappedText = wordWrap(text, 8);

    // @ts-ignore
    let canvas = new Canvas(505, 560, "png");
    let tohruImg = await loadAssetLazyAsync("./assets/tohru.png");

    // Create white rectangle, fill whole canvas, add image rotate text and place.
    canvas
        .setColor("white")
        .addRect(0,0, 505, 560)
        .addImage(tohruImg, 0, 0)
        .rotate(-5 * Math.PI / 180)
        .setTextAlign("center")
        .setColor("black")
        .setTextFont('48px Little Days Alt')
        .addMultilineText(wrappedText, 300,280);

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());


  } catch (error) {
    res.json({status: 500, message: error.toString() });
  }
};

export const yagami = async (req: Request, res: Response) => {
  try {
    let text = req.query.text;
    let wrappedText = wordWrap(text, 15);

    // @ts-ignore
    let canvas = new Canvas(529, 389, "png");
    let yagamiImg = await loadAssetLazyAsync("./assets/source-image.png");

    canvas
        .addImage(yagamiImg, 0, 0)
        .setTextFont("32px Little Days Alt")
        .addText(wrappedText, 10, 200)

    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());

  } catch (error) {
    res.json({status: 500, message: error.toString() });
  }
};
