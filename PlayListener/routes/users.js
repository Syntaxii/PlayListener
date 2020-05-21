const express = require("express");
const router = express.Router();
const { poolPromise } = require("./db");
const crypto = require("crypto");

router.route("/login").post((req, res) => {
  poolPromise
    .then(pool => {
      return pool.request().query(`
        SELECT PasswordSalt
        FROM USERS 
        WHERE 
            UserName = '${req.body.UserName}'`);
    })
    .then(result => {
      if (result.rowsAffected != 1) res.status(404).send("Incorrect Login");
      else {
        var PasswordHash = crypto
          .createHash("md5")
          .update(req.body.Password + result.recordset[0].PasswordSalt)
          .digest("hex");

        poolPromise
          .then(pool => {
            return pool.request().query(`
            SELECT UserName
            FROM USERS
            WHERE
                UserName = '${req.body.UserName}'
                AND PasswordHash = '${PasswordHash}'`);
          })
          .then(result => {
            if (result.rowsAffected != 1)
              res.status(404).send("Incorrect Login");
            else res.json(result.recordset);
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

router.route("/delete/:id").delete((req, res) => {
  poolPromise
    .then(pool => {
      return pool
        .request()
        .query(`DELETE FROM POSTS WHERE PostID=${req.params.id}`);
    })
    .then(result => {
      console.log("post deleted!");
      res.json(result.recordset);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
