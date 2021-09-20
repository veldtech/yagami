import { Pool } from "pg";
import { Request, Response, NextFunction } from "express";
import { Canvas } from "canvas-constructor";
import axios from "axios";
import { loadAssetLazyAsync } from "../asset-map";
import { RuntimeError } from "../runtime-error";

const MIKI_CDN_URL = "https://cdn.miki.bot/";
const DISCORD_CDN_URL = "https://cdn.discordapp.com/";

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
});

Canvas.registerFont("./assets/fonts/ARLRDBD.TTF", {
  family: "Arial Rounded MT Bold",
  weight: "bold",
});

Canvas.registerFont("./assets/fonts/YuGothL.ttc", {
  family: "Yu Gothic Light",
  weight: "light",
});

/**
 * Calculates Miki level from experience
 */
function CalculateLevel(exp: number) {
  var experience = exp;
  var Level = 0;
  var output = 0;
  while (experience >= output) {
    output = 10 + (output + Level * 20);
    Level++;
  }
  return Level;
}

/**
 * Calculates Miki experience from level
 */
function CalculateExp(level: number) {
  var output = level * level * 10;
  return output;
}

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

  let heart = await loadAssetLazyAsync("assets/heart.png");
  var size = 50 + Math.max(0, Math.min(value, 200));
  var fontSize = Math.round((size / 100) * 32);

  // ts-ignore can be removed with https://github.com/kyranet/canvasConstructor/pull/345
  //@ts-ignore
  var canvas = new Canvas(512, 256, "png")
    .addImage(avatarMe.data, 28, 28, 200, 200)
    .addImage(avatarOther.data, 284, 28, 200, 200)
    .addImage(
      heart,
      256 - Math.round(size / 2),
      128 - Math.round(size / 2),
      size,
      size
    )
    .setTextFont("bold " + fontSize.toString() + "px Arial Rounded MT Bold")
    .setColor("#FFFFFF")
    .setTextAlign("center")
    .addText(value + "%", 256, 128 + 10)
    .setAntialiasing("subpixel");

  res.set("Content-Type", "image/png");
  res.end(canvas.toBuffer());
};

export const user = async (req: Request, res: Response, next: NextFunction) => {
  var id = req.query.id;
  let hash = req.query.hash;

  try {
    var r = await pool.query(
      `select v."BackgroundColor" as backcolor, 
        v."ForegroundColor" as forecolor, 
        v."BackgroundId" as background, 
        u."Total_Experience" as experience, 
        u."Name" as name, 
        (select "Rank" from "mview_glob_rank_exp" where "Id" = $1) as rank 
        from dbo."Users" as u left join dbo."ProfileVisuals" v on u."Id" = v."UserId" where u."Id" = $1;`,
      [id]
    );
  } catch (ex) {
    return next(new RuntimeError(ex.toString()));
  }

  if (r == null) {
    return next(
      new RuntimeError("user query returned null.", "user not found", 404)
    );
  }

  let user = r.rows[0];

  let url = `${MIKI_CDN_URL}image-profiles/backgrounds/background-${
    user.background || 0
  }.png`;
  let avatarUrl = getUserAvatar(id, hash);

  let frontColor = user.forecolor || "#000000";
  let backColor = user.backcolor || "#000000";

  if (!frontColor.startsWith("#")) {
    frontColor = "#" + frontColor;
  }

  if (!backColor.startsWith("#")) {
    backColor = "#" + backColor;
  }

  var level = CalculateLevel(user.experience);
  var expNextLevel = CalculateExp(CalculateLevel(user.experience));

  try {
    var background = await axios.get(url, {
      responseType: "arraybuffer",
    });

    var avatar = await axios.get(avatarUrl, {
      responseType: "arraybuffer",
    });
  } catch (ex) {
    return next(new RuntimeError(ex.toString(), "could not load avatars"));
  }

  // ts-ignore can be removed with https://github.com/kyranet/canvasConstructor/pull/345
  // @ts-ignore
  var canvas = new Canvas(512, 256, "png")
    .addImage(background.data, 0, 0, 512, 256)
    .setColor(backColor + "20")
    .addRect(0, 124, 512, 50)
    .addRect(15, 216, 512 - 30, 25)
    .setColor(frontColor + "60")
    .addRect(18, 219, (user.experience / expNextLevel) * 476, 19)
    .setTextFont("48px Arial Rounded MT Bold")
    .setColor(frontColor + "FF")
    .addText(user.name, 15, 166, 512)
    .setTextAlign("left")
    .setTextFont("bold 32px Arial Rounded MT Bold")
    .addText("LV", 15, 216)
    .setTextFont("42px Yu Gothic Light")
    .addText(level.toString(), 60, 216)
    .setTextAlign("right")
    .setTextFont("32px Arial")
    .addText("#", 512 - 15, 216)
    .setTextFont("42px Yu Gothic Light")
    .addText(user.rank, 512 - 35, 216)
    .setTextFont("20px Yu Gothic Light")
    .setTextAlign("center")
    .addText(user.experience + "/" + expNextLevel, 256, 236)
    .addRoundImage(avatar.data, 10, 10, 100, 100, 50);

  res.set("Content-Type", "image/png");
  return res.status(200).end(canvas.toBuffer());
};
