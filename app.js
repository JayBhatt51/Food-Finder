const express = require('express');
const session = require('express-session');
const path = require('path');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const uri = 'mongodb+srv://jaybhatt51:jaybhatt51@cluster0.y2m8s6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
let db;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db('foodfinder');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

connectToMongoDB();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

const SECRET_KEY = 'your_secret_key';

// Render login form
app.get('/', (req, res) => {
    res.render('login.html');
});

// Render sign-up form
app.get('/sign-up-form', (req, res) => {
    res.render('signup.html');
});

// Handle sign-up form submission
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const collection = db.collection('Users');
    try {
        // Check if the username already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // If username doesn't exist, proceed with signup
        const hashedPassword = await bcrypt.hash(password, 10);
        await collection.insertOne({ username, password: hashedPassword });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signing up');
    }
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const collection = db.collection('Users');
    try {
        const user = await collection.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            req.session.token = token;
            res.redirect('/recipe');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// Render recipe page
app.get('/recipe', (req, res) => {
    if (req.session.token) {
        const decoded = jwt.verify(req.session.token, SECRET_KEY);
        res.render('recipe.html', { username: decoded.username });
    } else {
        res.redirect('/');
    }
});

app.get('/food', (req, res) => {
    if (req.session.token) {
        const decoded = jwt.verify(req.session.token, SECRET_KEY);
        res.render('food.html', { username: decoded.username });
    } else {
        res.redirect('/');
    }
});

app.get('/drink', (req, res) => {
    if (req.session.token) {
        const decoded = jwt.verify(req.session.token, SECRET_KEY);
        res.render('drink.html', { username: decoded.username });
    } else {
        res.redirect('/');
    }
});

// Handle logout
app.get('/logout', (req, res) => {
    req.session.token = null; // Clear the token from the session
    req.session.destroy(); // Destroy the session
    res.redirect('/');
});


app.listen(8989, () => {
    console.log('Server running on http://localhost:8989');
});
