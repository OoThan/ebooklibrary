const User = require('../models/user');
const sha256 = require('sha256');

const renderLogin = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.render('login');
        } else {
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.status(400).json(err);
    }
};

const renderRegister = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.render('register');
        } else {
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.status(400).json(err);
    }
}

const register = async (req, res) => {
    try {
        const username = req.body.username;
        const password = sha256(req.body.password);
        const time = new Date();
        const sessionToken = sha256(username + time.toString());
        const newUser = new User({ 
            username: username, 
            password: password, 
            sessionToken: sessionToken 
        });
        await newUser.save();
        res.cookie('token', sessionToken, {
            max_age: 30*24*60*60*60,
        });
        res.redirect('/dashboard');
    } catch (err) {
        res.status(400).json(err);
    }
};

const login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = sha256(req.body.password);
        const time = new Date();
        const sessionToken = sha256(username + time.toString());
        let user = await User.findOne({ username: username, password: password });
        if (!user || !sessionToken) {
            res.status(206).json('Invalid Login Credentials');
        } else {
            user.sessionToken = sessionToken;
            await user.save();
            res.cookie('token', sessionToken, {
                max_age: 30*24*60*60*60,
            });
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.status(400).json(err);
    }
};  

const logout = async (req, res) => {
    try {
        const sessionToken = req.cookies.token;
        await User.updateOne({ sessionToken: sessionToken }, {sessionToken: null });
        return res.redirect('/');
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    renderLogin,
    renderRegister,
    register,
    login,
    logout
};
