import { Pool } from "pg";
import { Router } from "express";

const pool = new Pool({
	 user: process.env.user,
	 host: process.env.host,
	 database: process.env.database,
	 password: process.env.password,
	 port: Number(process.env.port)
});

function getUser(key, callback)
{
      pool.query("SELECT * from users where api_key = $1", [key], (err, r) =>
      {
            if(r != null)
            {
                  callback(r.rows[0]);
            }
      });
}

function authorize(req, res, next)
{
	if(req.query.key != null)
	{
            getUser(req.query.key, (r) =>
            {
                  if(r != null)
                  {
                        if(req.query.key == r.api_key)
                        {
                        next();
                        return;
                        }
                  }
                  else
                  {
                        res.send(JSON.stringify({
                              status : 403,
                              message : "Invalid API Key"
                        }));
                        return;
                  }
            });
	}
   else
   {
      res.send(JSON.stringify({
         status : 401,
         message : "Unauthorized"
      }));
   }
}

Router().use(authorize);

export default Router();