const mongoose = require('mongoose');

const schema = mongoose.Schema;

const bookSchema = new schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    cover: { type: String, default: 'default' },
    favorite: { type: Boolean, default: false },
    have_read: { type: Boolean, default: false },
    reading_now: { type: Boolean, default: false },
    tags: { type: Array },
    user_id: { type: String, required: true },
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
