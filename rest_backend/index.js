const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { auth } = require('./firebase');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');

const app = express();

app.use(cors(
    // {
    //     origin: 'http://localhost:8080'
    // }
));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome');
})

//signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    await createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            res.status(200).json({ message: "User signed up successfully", us: userCredential.user.email });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.status(500).json({ message: errorMessage, errorCode });
        })
})

//login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    await signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            res.status(200).json({ message: "User signed in successfully", us: userCredential.user.email });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.status(500).json({ message: errorMessage, errorCode });
        })
})

//read

//logout
app.post('/signout', async (req, res) => {
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