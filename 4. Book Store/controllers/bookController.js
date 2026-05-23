
const bookSchema = require('../model/bookSchema');
const path = require('path');
const fs = require('fs');

module.exports.getBooks = async(req,res)=>{
    try {
        const Books = await bookSchema.find();

        res.render('pages/Home', {
            books: Books
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports.getSingleBookPage = async (req, res) => {
    try {
        const book = await bookSchema.findById(req.params.id);

        if (!book) {
            return res.status(404).send("Book not found");
        }

        res.render('pages/singleBook', { book });

    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports.addBooks = async (req, res)=>{
    try {

        const {Title,Author,Category,Price,Quantity,Description} = req.body;

        const Image = req.file ? req.file.filename : null;

        const newBook = new bookSchema({Title,Author,Category,Price,Quantity,Description,Image});

        await newBook.save();

        res.redirect('/');
        
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports.viewBooks = async(req,res)=>{
    try {
        const Books = await bookSchema.find();

        res.render('pages/viewBooks', {
            books: Books
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports.editBookPage = async (req, res) => {
    try {
        const book = await bookSchema.findById(req.params.id);

        res.render('pages/editBook', { book });

    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports.updateBook= async (req, res) => {
    try {
        const { Title, Author, Category, Price, Quantity, Description } = req.body;

        const existingBook = await bookSchema.findById(req.params.id);

        if (!existingBook) {
            return res.status(404).send("Book not found");
        }

        const updatedData = { Title, Author, Category, Price, Quantity, Description };

        if (req.file) {

            if (existingBook.Image) {
                const oldImagePath = path.join(__dirname, "..", "public", "uploads", existingBook.Image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updatedData.Image = req.file.filename;
        }

        await bookSchema.findByIdAndUpdate(req.params.id, updatedData);

        res.redirect('/view-Book');

    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports.deleteBook = async (req,res)=>{
    try {
        await bookSchema.findByIdAndDelete(req.params.id);
        res.redirect('/view-Book');
    } catch (error) {
        res.status(500).send(error.message);
    }
}
