const { Pool, Client } = require('pg');
const client = new Client();
const express = require('express');
const router = express.Router();

const pool = new Pool({
	 user: global.config.user,
	 host: global.config.host,
	 database: global.config.database,
	 password: global.config.password,
	 port: global.config.port,
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

router.use(authorize);

module.exports = router;