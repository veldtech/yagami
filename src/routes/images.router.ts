import { Request, Response } from "express";
import * as gm from "gm";
import axios from "axios";

function wordWrap(str: string, maxWidth:  number) {
		let newLineStr = "\n"; 
		let done = false; 
		let res = "";
    do 
    {
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

        if (str.length < maxWidth)
            done = true;
    } while (!done);

    return res + str;
}

function testWhite(x: string) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
}

export const box = async function(req: Request , res: Response)
{
	try
	{
		const url: string = req.query.url;

		var text = req.query.text;
		var wrappedText = wordWrap(text, 15);
		
		const response = await axios.get<string>(url)

		var image = gm(response.data)
			.resize(190, 190, "!")
			.rotate("black", 28)
			.extent(600, 399)
			.roll(350, 100)

		image.draw("image over 0,0 0,0 \"./assets/box.png\"")

		image.font("./assets/fonts/Felt Regular.ttf", 24)
			.drawText(50, 275, wrappedText);

		image.toBuffer("PNG",function (err, buffer) 
		{
			if (err) { 
				res.send(err.toString()) 
			} else {
				res.set("Content-Type", "image/png");
				res.send(buffer);
			}
		});
	}
	catch(error)
	{
		res.send(JSON.stringify({status:500, message:error.toString()}));
	}
};

export const yugioh = async function (req : Request, res: Response)
{
	try
	{
		var url = req.query.url;

		const response = await axios.get<string>(url)
		
		var image = gm(response.data)
			.rotate("white", -10)
			.coalesce()
			.resize(280, 280, "!")
			.extent(480, 768, "-5+25")
		
		image.draw("image over 0,0 0,0 \"./assets/heartofthecard.png\"")

		image.toBuffer("PNG",function (err, buffer) 
		{
			if (err) {
				res.send(err.toString());
			} else {
				res.set("Content-Type", "image/png");
				res.send(buffer);
			}
		});
	}
	catch(error)
	{
		res.send(JSON.stringify({status:500, message:error.toString()}));
	}
};

export const disability = async function (req: Request, res: Response) {
	try {
		var url : string = req.query.url;

		const response = await axios.get(url)
		
		var image = gm(response.data)
			.coalesce()
			.resize(100, 100, "!")
			.extent(467, 397, "-320-180")
		
		image.draw("image over 0,0 0,0 \"./assets/disability.png\"")

		image.toBuffer("PNG",function (err, buffer) {
			if (err) {
				res.send(err.toString());
			} else {
				res.set("Content-Type", "image/png");
				res.send(buffer);
			}
		});
	} catch(error) {
		res.send(JSON.stringify({status:500, message:error.toString()}));
	}
};

export const tohru = function (req: Request, res: Response) {
	try {	
		var text = req.query.text;
		var wrappedText = wordWrap(text, 8);

		var image = gm(505, 560, "white");
		
		image.region(400, 400, 150, 100)
			.gravity("Center")
			.fontSize(48)
			.font("./assets/fonts/Little Days.ttf")
			.drawText(0, 0, wrappedText)
			.rotate("transparent", -5);

		image.region(505, 560).draw("image over 0,0 0,0 \"./assets/tohru.png\"");

		image.toBuffer("PNG",function (err, buffer) {
			if (err) {
				res.send(err.toString());
				console.log(err);
			} else {
				res.set("Content-Type", "image/png");
				res.send(buffer);
			}
		});
	} catch(error) {
		res.send(JSON.stringify({status:500, message:error.toString()}));
	}
};

export const yagami = function (req: Request, res: Response) {
	try {	
		var text = req.query.text;
		var wrappedText = wordWrap(text, 15);

		var image = gm("./assets/source-image.png");
		
		console.log(image);

		image.font("./assets/fonts/Felt Regular.ttf", 32)
			.drawText(10, 200, wrappedText);

		image.toBuffer("PNG",function (err, buffer) {
			if (err) {
				res.send(err.toString());
			} else {
				res.set("Content-Type", "image/png");
				res.send(buffer);
			}
		});
	} catch(error) {
		res.send(JSON.stringify({status:500, message:error.toString()}));
	}
};