var express = require('express');
var router = express.Router();
const main = require('../controllers/main');

router.get('/', main.renderIndex);

router.get('/dashboard', main.renderDashboard);

router.get('/dashboard/favourites', main.renderFavourites);

router.get('/dashboard/have-read', main.renderHaveRead);

router.get('/dashboard/to-read', main.renderToRead);

router.get('/dashboard/reading-now', main.renderReadingNow);

router.get('/my-account', main.renderAccount);

router.post('/upload', main.upload);

router.get('/profile/:username', main.renderProfile);

router.get('/books/:username', main.renderUserBook);

router.get('/change-avatar', main.renderEditAvatar);

router.post('/change-avatar', main.editAvatar);

router.post('/add-book', main.addBook);

router.post('/delete-book', main.deleteBook);

router.get('/edit-book', main.renderEditBook);

router.post('/edit-book', main.editBook);

router.post('/logout', main.logout);

module.exports = router;
