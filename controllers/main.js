const User = require('../models/user');
const Book = require('../models/book');

const renderIndex = (req, res) => {
    res.render('index');
};

const renderDashboard = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            const books = await Book.aggregate([
                {
                    $match: {
                        have_read: false,
                        user_id: String(user._id),
                    }
                }
            ]);
            res.render('dashboard', {
                title: 'eBook Library',
                username: user.username,
                avatar: user.avatar,
                books,
                self: true
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const renderFavourites = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            const books = await Book.aggregate([
                {
                    $match: {
                        favourite: true,
                        user_id: String(user._id),
                    }
                }
            ]);
            res.render('dashboard', {
                title: 'Favourites',
                username: user.username,
                avatar: user.avatar,
                books,
                self: true
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const renderHaveRead = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            const books = await Book.aggregate([
                {
                    $match: {
                        have_read: true,
                        user_id: String(user._id),
                    }
                }
            ]);
            res.render('dashboard', {
                title: 'Have Read',
                username: user.username,
                avatar: user.avatar,
                books,
                self: true
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const renderToRead = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            const books = await Book.aggregate([{
                    $match: {
                        have_read: false,
                        user_id: String(user._id),
                    }
            }]);
            res.render('dashboard', { 
                title: "To Read", 
                username: user.username, 
                avatar: user.avatar, 
                books, 
                self: true 
            });
        }     
    } catch (err) {
        res.status(500).json(err);
    } 
};

const renderReadingNow = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            const books = await Book.aggregate([{
                $match: {
                    reading_now: true,
                    user_id: String(user._id),
                }
            }]);
            res.render('dashboard', { 
                title: "Reading Now", 
                username: user.username, 
                avatar: user.avatar, 
                books, 
                self: true 
            });
        }    
    } catch (err) {
        res.status(500).json(err);
    }
};

const renderAccount = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            let first_name = '',
                last_name = '';
            if (user.full_name !== '' && user.full_name !== null) {
                const _name = user.full_name.split(" ");
                if (_name.length > 1) {
                    first_name = _name[0];
                    last_name = _name[1];
                }
            }
            res.render('settings', {
                username: user.username,
                avatar: user.avatar,
                first_name: first_name,
                last_name: last_name,
                email: user.email,
                instagram: user.instagram,
                facebook: user.facebook,
                twitter: user.twitter,
                wattpad: user.wattpad
            })
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const upload = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            user.Full_name = req.body.first_name + " " + req.body.last_name;
            user.email = req.body.email;
            user.instagram = req.body.instagram;
            user.facebook = req.body.facebook;
            user.twitter = req.body.twitter;
            user.wattpad = req.body.wattpad;

            await user.save();
            const url = '/profile/' + user.username;
            res.redirect(url);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const renderProfile = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } 
        if (user.username == req.params.username) {
            let first_name = '', last_name = '', full_name = '';
            if (user.full_name) {
                full_name = user.full_name.split(" ");
                if (full_name.length > 1) {
                    first_name = full_name[0];
                    last_name = full_name[1];
                }
            }
            res.render('profile', {
                title: 'My Profile',
                username: user.username,
                avatar: user.avatar,
                full_name: user.full_name,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                instagram: user.instagram,
                facebook: user.facebook,
                twitter: user.twitter,
                wattpad: user.wattpad,
                self: true
            });
        } else {
            const view = await User.findOne({ username: req.params.username });
            let first_name ='', last_name ='', full_name ='';
            if (view.full_name) {
                full_name = view.full_name.split(" ");
                if (full_name.length > 1)  {
                    first_name = full_name[0];
                    last_name = full_name[1];
                }
            }
            res.render('profile', {
                title: 'My Profile',
                username: user.username,
                avatar: user.avatar,
                viewUsername: view.username,
                viewAvatar: view.avatar,
                full_name: view.full_name,
                first_name: view.first_name,
                last_name: view.last_name,
                email: view.email,
                instagram: view.instagram,
                facebook: view.facebook,
                twitter: view.twitter,
                wattpad: view.wattpad,
                self: true
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};


