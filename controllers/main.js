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
                self: false
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const renderUserBook = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        let user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } 
        if (user.username == req.params.username) {
            res.redirect('/dashboard')
        } else {
            const view = await User.findOne({ username: req.params.username });
            const books = await Book.find({ user_id: view._id });
            res.render('bashboard', { 
                title: `${view.username}'s Books`,
                username: user.username,
                avatar: user.avatar,
                viewUsername: view.username,
                self: false,
                books
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const renderEditAvatar = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            res.render('avatar', {
                username: user.username,
                avatar: user.avatar,
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const editAvatar = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            if (req.body.avatar) user.avatar = req.body.avatar;
            await user.save();
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const logout = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            user.sessionToken = 'null';
            user.save();
            res.redirect('/users/login');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const addBook = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            let cover = 'default';
            if (req.body.book_cover) cover = req.body.book_cover;
            const newBook = new Book({
                name: req.body.book_name,
                author: req.body.author,
                link: req.body.book_link,
                cover: cover,
                user_id: String(user._id)
            });
            await newBook.save();
            res.redirect('/dashboard');
        }
    } catch (err) {

    }
};

const deleteBook = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            const book_id = req.body.book_id;
            await Book.deleteOne({ _id: book_id, user_id: String(user._id) });
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const renderEditBook = async (req, res) => {
    try {
        const book_id = req.query.book_id;
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            const book = await Book.findOne({ _id: book_id, user_id: String(user._id) });
            res.render('edit-book', { 
                book_id: book._id,
                book_name: book.name,
                author: book.author,
                book_link: book.link,
                book_cover: book.cover,
                book_favourite: book.favourite,
                book_have_read: book.have_read,
                book_reading_now: book.reading_now,
                book_tags: book.tags,
                username: user.username,
                avatar: user.avatar
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const editBook = async (req, res) => {
    try {
        const sessionToken = await req.cookies.token;
        const user = await User.findOne({ sessionToken: sessionToken });
        if (!user || !sessionToken) {
            res.redirect('/users/login');
        } else {
            const book_id = req.body.book_id;
            let book = await Book.findOne({ _id: book_id, user_id: String(user._id) });
            book.name = req.body.book_name;
            book.author = req.body.author;
            book.link = req.body.book_link;
            book.cover = req.body.book_cover;
            book.favourite = req.body.book_favourite;
            book.have_read = req.body.book_have_read;
            book.reading_now = req.body.book_reading_now;
            const tags = req.body.book_tags.trim().split(",");
            book.tags = tags;
            await book.save();
            res.redirect('/dashboard');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    renderIndex,
    renderDashboard,
    renderHaveRead,
    renderToRead,
    renderFavourites,
    renderReadingNow,
    renderAccount,
    renderEditAvatar,
    renderEditBook,
    renderProfile,
    renderUserBook,
    logout,
    addBook,
    deleteBook,
    editBook,
    upload,
    editAvatar,
};
