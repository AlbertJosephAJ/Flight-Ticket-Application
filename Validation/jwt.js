const JWT = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  createUserToken: (id) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const options = {
        expiresIn: "3d",
        issuer: "joseph.com",
        audience: id,
      };
      const secret = process.env.USER_SECRET;
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  },
  verifyUserToken: (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({message : "Unauthorized Request"});
    }
    JWT.verify(token, process.env.USER_SECRET, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") return res.json({message : "Unauthorized"});
        else return res.json({message : err.message});
      }
      req.payload = payload;
      next();
    });
  },
  createAdminToken: (id) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const options = {
        expiresIn: "3d",
        issuer: "joseph.com",
        audience: id,
      };
      const secret = process.env.ADMIN_SECRET;
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  },
  verifyAdminToken: (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({message : "Unauthorized Request"});
    }
    JWT.verify(token, process.env.ADMIN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") return res.json({message : "Unauthorized"});
        else return res.json({message : err.message});
      }
      req.payload = payload;
      next();
    });
  },
};
