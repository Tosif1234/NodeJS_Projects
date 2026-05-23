const express = require('express')

const router = express.Router();

const multer = require('multer');

const bookcontroller = require('../controllers/bookController');

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null, 'public/uploads');
    },
    filename : (req, file,cb) => {
        cb(null, Date.now() + '-'+ file.originalname)
    }
})

const upload = multer({storage});

router.get('/', bookcontroller.getBooks);
router.get('/book/:id', bookcontroller.getSingleBookPage);

router.get('/add-Book', (req,res)=>{
    res.render('pages/addBook');
});

router.post('/add-Book', upload.single('Image') ,bookcontroller.addBooks);

router.get('/view-Book', bookcontroller.viewBooks);
router.get('/edit-Book/:id', bookcontroller.editBookPage);

router.post('/edit-Book/:id', upload.single('Image'), bookcontroller.updateBook);

router.post('/delete/:id',bookcontroller.deleteBook);


module.exports = router;