const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const dbConfig = require("./config/db.config");

const app = express();
const Role = db.role;

var corsOptions = {
    origin: "http://localhost:8081"
};

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.use(cors(corsOptions));

// parse requests of content-type application/json
app.use(bodyParser.json());

// parse requests of content-type application/www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}));

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });



app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Florent application"
    });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count === 0) {
            new Role({
                name: "user"
            }).save(er => {
                if(er) {
                    console.log("error", er);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator"
            }).save(er => {
                if(er) {
                    console.log("error", er);
                }

                console.log("added 'moderator' to roles collection");
            })

            new Role({
                name: "admin"
            }).save(er => {
                if(er) {
                    console.log("error", er);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}