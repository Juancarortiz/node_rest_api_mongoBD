const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

//  MIDDLEWARE
const getbook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: "Invalid book id" });
    }
    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book" });
    }
    res.book = book;
    next();
}


// [GET ALL] obtener todos los recursos
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books)
        if (books.length === 0) {
            return res.status(204).json({});
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [POST] crear un nuevo recurso 
router.post('/', async (req, res) => {
    const { title, author, genere, publication_date } = req?.body
    if (!title || !author || !genere || !publication_date) {
        return res.status(400).json({
            message: "Los Campos title, author, genere y publication_date son obligatorios"
        });
    }

    const book = new Book(
        {
            title,
            author,
            genere,
            publication_date
        }
    );

    try {
        const newBook = await book.save();
        console.log('POST', newBook)
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// [GET ID] obtener recurso por id.
router.get('/:id', getbook, async (req, res) => {
    console.log('GET ID', res.book)
    res.json(res.book);
});

// [PUT] modifica recurso por ID
router.put('/:id', getbook, async (req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genere = req.body.genere || book.genere
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBook = await book.save();
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

    res.json(res.book);
});

// [PATCH] modifica recurso por ID
router.patch('/:id', getbook, async (req, res) => {
    if (!req.body.title && !req.body.author && !req.body.genere && !req.body.publication_date) {
        return res.status(400).json({ message: "AL menos uno de estos campos debe ser enviado: (title, author, genere, publication_date)" });
    };
    try {
        const book = res.book;
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genere = req.body.genere || book.genere
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBook = await book.save();
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

    res.json(res.book);
});

// [DELETE FOR ID] borra recurso por ID.
router.delete('/:id', getbook, async (req, res) => {
    try {
        const book = res.book;
        await book.deleteOne({ _id: book._id });
        res.json({ message: `Libro ${book.title} fue eliminado con exito` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.json(res.book);
});

module.exports = router;

