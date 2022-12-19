import { Request, Response, NextFunction } from "express";
import { Canvas, registerFont, resolveImage } from "canvas-constructor/skia";
import axios, { AxiosResponse } from "axios";
import { loadAssetLazyAsync } from "../asset-map";
import { RuntimeError } from "../runtime-error";

const MIKI_CDN_URL = "https://cdn.miki.bot/";
const DISCORD_CDN_URL = "https://cdn.discordapp.com/";

registerFont("Arial Rounded MT Bold", "./assets/fonts/ARLRDBD.TTF");

registerFont("Satoshi", "./assets/fonts/Satoshi-Regular.ttf");
registerFont("SatoshiMedium", "./assets/fonts/Satoshi-Medium.ttf");
registerFont("SatoshiBold", "./assets/fonts/Satoshi-Bold.ttf");

function getUserAvatar(id: string, hash: Optional<string>) {
  if (hash == null || hash == undefined || hash == "") {
    return `${DISCORD_CDN_URL}embed/avatars/${Number(id) % 5}.png`;
  }
  return `${DISCORD_CDN_URL}avatars/${id}/${hash}.png`;
}

export const ship = async (req: Request, res: Response, next: NextFunction) => {
  let me = req.query.me;
  let other = req.query.other;
  let value = req.query.value || 0;
  let myHash = req.query.me_hash;
  let otherHash = req.query.other_hash;

  let avatarUrl = getUserAvatar(me, myHash);
  let avatarUrlOther = getUserAvatar(other, otherHash);

  let avatarMe = null;
  let avatarOther = null;

  try {
    avatarMe = await axios.get(avatarUrl, {
      responseType: "arraybuffer",
    });

    if (avatarUrlOther != avatarUrl) {
      avatarOther = await axios.get(avatarUrlOther, {
        responseType: "arraybuffer",
      });
    } else {
      avatarOther = avatarMe;
    }
  } catch (ex) {
    return next(new RuntimeError(ex.toString(), "could not load avatars"));
  }

  let heart = await resolveImage(
    await loadAssetLazyAsync("./assets/heart.png")
  );
  var size = 50 + Math.max(0, Math.min(value, 200));
  var fontSize = Math.round((size / 100) * 32);

  var canvas = new Canvas(512, 256)
    .printImage(await resolveImage(avatarMe.data), 28, 28, 200, 200)
    .printImage(await resolveImage(avatarOther.data), 284, 28, 200, 200)
    .printImage(
      heart,
      256 - Math.round(size / 2),
      128 - Math.round(size / 2),
      size,
      size
    )
    .setTextFont(fontSize.toString() + "px Arial Rounded MT Bold")
    .setColor("#FFFFFF")
    .setTextAlign("center")
    .printText(value + "%", 256, 128 + 10);

  const buffer = await canvas.toBuffer("png");

  res.set("Content-Type", "image/png").end(buffer);
};

export const user = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const hash = req.query.hash;
  const backgroundId = req.query.backgroundId;
  const foregroundColor = req.query.foregroundColor;
  const backgroundColor = req.query.backgroundColor;
  const experience = req.query.experience;
  const maxExperience = req.query.maxExperience;
  const level = req.query.level;
  const name = req.query.name;
  const rank = req.query.rank;

  let url = `${MIKI_CDN_URL}image-profiles/backgrounds/background-${
    backgroundId ?? 2
  }.png`;
  let avatarUrl = getUserAvatar(id, hash);

  let frontColor = foregroundColor || "#E95882";
  let backColor = backgroundColor || "#000000";

  if (!frontColor.startsWith("#")) {
    frontColor = "#" + frontColor;
  }

  if (!backColor.startsWith("#")) {
    backColor = "#" + backColor;
  }

  let background: AxiosResponse<Buffer> = null;
  let avatar: AxiosResponse<Buffer> = null;

  try {
    background = await axios.get(url, {
      responseType: "arraybuffer",
    });
  } catch (er) {
    return next(new RuntimeError(er.toString(), "could not load background"));
  }

  try {
    avatar = await axios.get(avatarUrl, {
      responseType: "arraybuffer",
    });
  } catch (ex) {
    return next(new RuntimeError(ex.toString(), "could not load avatars"));
  }

  var backgroundImage = await resolveImage(background.data);

  const rankSize = new Canvas(512, 128)
    .setTextFont("20px SatoshiBold")
    .measureText(rank.toString());

  const levelSize = new Canvas(512, 128)
    .setTextFont("20px SatoshiBold")
    .measureText(level.toString());

  // pre-calculated from figma
  const levelLabelSize = 47;
  const rankLabelSize = 46;

  const rankX = 512 - 26 - rankSize.width;
  const rankLabelX = rankX - 4 - rankLabelSize;
  const levelX = rankLabelX - 16 - levelSize.width;
  const levelLabelX = levelX - 4 - levelLabelSize;

  var canvas = new Canvas(512, 128)
    // Print background
    .printRoundedImage(backgroundImage, 0, -64, 512, 256, 6)
    // Print blurry panel
    .setColor("rgba(0, 0, 0, 0.33)")
    .printRoundedRectangle(11, 10, 491, 108, 8)
    // Print overhead exp bar
    .setColor("#FFFFFF3C")
    .printRoundedRectangle(128, 64, 358, 10, 999)
    .setColor(frontColor)
    .printRoundedRectangle(128, 64, (experience / maxExperience) * 358, 10, 999)
    // Print avatar part
    .printCircularImage(await resolveImage(avatar.data), 69, 64, 42)
    .setTextFont("28px SatoshiBold")
    .setColor(backColor)
    .printText(name, 128, 51, 358)
    .setTextFont("20px SatoshiMedium")
    .printText("Level", levelLabelX, 102)
    .printText("Rank", rankLabelX, 102)
    .setTextFont("20px SatoshiBold")
    .setColor(frontColor + "FF")
    .printText(level.toString(), levelX, 102)
    .printText(rank, rankX, 102);

  res.set("Content-Type", "image/png");
  return res.status(200).end(await canvas.toBuffer("png"));
};
