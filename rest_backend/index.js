const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');

const { auth } = require('./firebase');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } = require('firebase/auth');
const mongoose = require('mongoose');

const Users = require('./models/Users');

const app = express();

app.use(cors(
    // {
    //     origin: 'http://localhost:8080'
    // }
));
app.use(bodyParser.json());

mongoose.connect(
    process.env.MONGO_DB,
    console.log('Connected')
)

app.get('/', (req, res) => {
    res.send('Welcome');
})

//signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try{
        const createUser = await createUserWithEmailAndPassword(auth, email, password);
        //mongodb
        const users = new Users({
            userID: createUser.user.uid,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            city: req.body.city,
            state: req.body.state
        });
        try{
            const addUser = await users.save();
            res.status(200).json({message: "User signed up successfully", data: addUser});
        }catch(err){
            res.status(500).json(err);
        }
    }catch(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(500).json({ message: errorMessage, errorCode });
    }
})

//login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        const login = await signInWithEmailAndPassword(auth, email, password);
        res.status(200).json({ message: "User signed in successfully", us: login.user.email });
    }catch(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(500).json({ message: errorMessage, errorCode });
    }
})

//current user?
app.get('/isUser', async (req, res) => {
    onAuthStateChanged(auth, user => {
        if (!user) {
            res.status(200).json({ message: "User not found!" });
        } else {
            const uid = user.uid;
            res.status(200).json({ message: "User found!", uid });
        }
    })
});

//get all users
app.get('/getUsers', async (req, res) => {
    try{
        const getUsers = await Users.find();
        res.status(200).json(getUsers);
    }catch(err){
        res.status(500).json(err);
    }
})

//get specific user
app.get('/getUser', async (req, res) => {
    try{
        const user = auth.currentUser.uid;
        const getUser = await Users.find({ userID : user })
        res.status(200).json(getUser);
    }catch(err){
        res.status(500).json(err);
    }
})

//update specific user
app.patch('/updateUser', async (req, res) => {
    try{
        const user = auth.currentUser.uid;
        const updateUser = await Users.updateOne(
            { userID : user },
            { $set: { 
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                city: req.body.city,
                state: req.body.state
            } }
            );
        res.status(200).json({ message: "Update successfully", user: updateUser });
    }catch(err){
        res.status(500).json(err);
    }
})

//delete specific user
app.delete('/user', async (req, res) => {
    try{
        const user = auth.currentUser.uid;
        const removeUser = await Users.findOneAndRemove({ userID : user })
        res.status(200).json({ message: "Delete successfully", user: removeUser });
    }catch(err){
        res.status(500).json(err);
    }
})

//logout
app.get('/signout', async (req, res) => {
    signOut(auth).then(() => {
        res.status(200).json({ message: "Signout successfully" });
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(500).json({ message: errorMessage, errorCode });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);