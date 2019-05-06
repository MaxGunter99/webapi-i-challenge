const express = require('express');
const db = require("./data/db");
const server = express();
server.use(express.json());

//HOME ENDPOINT
server.get("/", (req, res) => {
    res.send("Building RESTful APIs with Node.js and Express Mini");
});

// GET ALL USERS ENDPOINT
server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(({ code, message }) => {
        res.status(code).json({ success: false, message });
    });
});

// GET INDIVIDUAL USER - get a particular user by id
server.get( '/api/users/:id' , (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(user => {
        if (user) {
            res.status(200).json({ success: true, user });
        } else {
            res
                .status(404)
                .json({ success: false, message: "Cannot find user by that id" });
        }
    })
    .catch(({ code, message }) => {
        res.status(code).json({ success: false, message });
    });
});

// POST - Add an object to the db in our server
server.post('/api/users', (req, res) => {
    const userInfo = req.body;
    console.log("request body name", userInfo);

    db.insert(userInfo)
        .then(newUser => {
            // user was successfully added
            res.status(201).json({ success: true, newUser});
        })
        .catch(({ code, message }) => {
            res.status(code).json({ success: false, message });
        });
});

// DELETE - remove a user from the db
server.delete( '/api/users/:id' , (req, res) => {
    // another way to get data from our user is in the req.params  (the url parameters)
    const id = req.params.id;
    db.remove(id)
        .then(deleted => {
            // the data layer returns the deleted record, but we wont use it, instead using the response headers status code and .end() to terminate the request
            res.status(204).json(deleted);
        })
        .catch(({ code, message }) => {
            res.status(code).json({ success: false, message });
        });
});

// PUT - require an id from the params and some data from the user on the body that they want to change
server.put( '/api/users/:id' , (req, res) => {
    const id = req.params.id;
    const user = req.body;

    db.findById(id)
        .then((update) => {
            if (update.length < 1 ) {
                res.status(404).json({ success: false, message: "Cannot find user to update" });
            } else {
                db.update(id, user)
                    .then((user) => {
                        res.status(200).json({ success: true, user });
                    })
            }
        })
        .catch(({ code, message }) => {
            res.status(code).json({ success: false, message });
        });
});

//SERVER PORT ON 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log(`\n*** Server listening on port ${PORT} ***\n`); });