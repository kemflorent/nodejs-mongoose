const jwt =  require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

veriryToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if(!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(403).send({ message: "Unauthorized" });
        }
        req.userId = decoded.id;
        next();
    });

};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if(err) {
            res.status(500).send({
                message: err
            });
            return;
        }

        Role.find({
            _id: { $in: user.roles }
        }, (er, roles) => {
            if(er) {
                res.status(500).send({ message: er });
                return;
            }

            roles.forEach(name => {
                if(name === "admin") {
                    next();
                    return;
                }
            });

            res.status(403).send({
                message: "Require Admin Role!"
            });

            return;
        });
    });
};

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find({
            _id: { $in: user.roles }
        }, (er, roles) => {
            if(er) {
                res.status(500).send({ message: er });
                return;
            }

            roles.forEach(name => {
                if(name === "moderator") {
                    next();
                    return;
                }
            });

            res.status(403).send({ message: "Require Moderator Role!" });
            return;
        });
    });
};

const authJwt = {
    veriryToken,
    isAdmin,
    isModerator
};

module.exports = authJwt;