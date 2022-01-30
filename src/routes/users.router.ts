import { Pool } from "pg";
import { Request, Response, NextFunction } from "express";
import { Canvas, registerFont, resolveImage } from "canvas-constructor/skia";
import axios, { AxiosResponse } from "axios";
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

registerFont("Satoshi", "./assets/fonts/Satoshi-Regular.ttf");
registerFont("SatoshiBold", "./assets/fonts/Satoshi-Bold.ttf");

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
  return level * level * 10;
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

  let heart = await resolveImage(await loadAssetLazyAsync("assets/heart.png"));
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
    .setTextFont("bold " + fontSize.toString() + "px Arial Rounded MT Bold")
    .setColor("#FFFFFF")
    .setTextAlign("center")
    .printText(value + "%", 256, 128 + 10);

  res.set("Content-Type", "image/png");
  res.end(canvas.toBuffer("png"));
};

export const user = async (req: Request, res: Response, next: NextFunction) => {
  var id = req.query.id;
  let hash = req.query.hash;

  try {
    var result = await pool.query(
      `select v."BackgroundColor" as backcolor, 
        v."ForegroundColor" as forecolor, 
        v."BackgroundId" as background, 
        u."Total_Experience" as experience, 
        u."Name" as name, 
        (select "Rank" from dbo."mview_glob_rank_exp" where "Id" = $1) as rank 
        from dbo."Users" as u left join dbo."ProfileVisuals" v on u."Id" = v."UserId" where u."Id" = $1;`,
      [id]
    );
  } catch (ex) {
    return next(new RuntimeError(ex.toString()));
  }

  if (!result || !result.rows.length) {
    return next(
      new RuntimeError("user query returned null.", "user not found", 404)
    );
  }

  let user = result.rows[0];

  let url = `${MIKI_CDN_URL}image-profiles/backgrounds/background-${
    user?.background ?? 2
  }.png`;
  let avatarUrl = getUserAvatar(id, hash);

  let frontColor = user.forecolor || "#E95882";
  let backColor = user.backcolor || "#000000";

  if (!frontColor.startsWith("#")) {
    frontColor = "#" + frontColor;
  }

  if (!backColor.startsWith("#")) {
    backColor = "#" + backColor;
  }

  var level = CalculateLevel(user.experience);
  var expNextLevel = CalculateExp(level);

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

  var canvas = new Canvas(512, 256)
    // Print background
    .printImage(backgroundImage, 0, 0, 512, 256)
    .setFilter("blur(4px)")
    .printImage(backgroundImage, 0, 0, 341, 256, 0, 0, 341, 256)
    .resetFilters()
    // Print blurry panel
    .setColor("rgba(255, 255, 255, 0.2)")
    .setFilter("blur(4)")
    .printRectangle(0, 4, 341, 252)
    .setFilter("none")
    // Print overhead exp bar
    .setColor("#FFFFFF3C")
    .printRectangle(0, 0, 512, 4)
    .setColor(frontColor)
    .printRectangle(0, 0, (user.experience / expNextLevel) * 512, 4)
    // Print avatar part
    .printCircularImage(await resolveImage(avatar.data), 44, 48, 28)
    .setTextFont("bold 24px SatoshiBold")
    .setColor(backColor)
    .printText(user.name, 86, 56, 237)
    // .setTextFont("16px Satoshi")
    // .setColor("#00000099")
    // .printText("Subtitle", 86, 68, 237)
    // Print Stats Row
    .setColor(backColor)
    .setTextFont("20px SatoshiBold")
    .printText("Level", 16, 114)
    .setTextFont("24px SatoshiBold")
    .setColor(frontColor + "FF")
    .printText(level.toString(), 71, 114)
    .setTextFont("20px SatoshiBold")
    .setColor(backColor)
    .printText("Rank", 102 + level.toString().length * 14, 114)
    .setTextFont("24px SatoshiBold")
    .setColor(frontColor + "FF")
    .printText(user.rank, 156 + level.toString().length * 14, 114);

  res.set("Content-Type", "image/png");
  return res.status(200).end(await canvas.toBuffer("png"));
};
