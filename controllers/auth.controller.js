const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if(err) {
            res.status(500).send({ message: err });
            return;
        }

        if(req.body.roles) {
            Role.find({
                name: { $in: req.body.roles }
            }, (er, roles) => {
                if(er) {
                    res.status(500).send({ message: er });
                    return;
                }

                user.roles = roles.map(role => role._id);
                user.save(error => {
                    if(error) {
                        res.status(500).send({ message: error });
                        return;
                    }

                    res.send({ message: "User was registered successfully!"});
                });
            });
        } else {
            Role.findOne({ name: "user" }, (er, role) => {
                if(er) {
                    res.status(500).send({ message: er });
                    return;
                }

                user.roles = [role._id];
                user.save(error => {
                    if(error) {
                        res.status(500).send({ message: error });
                        return;
                    }

                    res.send({ message: "User was registered successfully!" });
                });
            });
        }

    });
};

signin = (req, res) => {
    User.findOne({
        username: req.body.username
    }).populate("roles", "-__v")
    .exec((err, user) => {
        if(err) {
            res.status(500).send({ message: err});
            return;
        }

        if(!user) {
            return res.status(404).send({ message: "User Not Found." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if(!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid Password!'
            });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 //24 hours
        });

        var authorities = [];

        user.roles.forEach(role => {
            authorities.push("ROLE_"+role.name.toUpperCase());
        });

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });

    });
};

module.exports = {
    signup,
    signin
};