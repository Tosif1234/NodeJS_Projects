const express = require('express');

const app = express();

const connectDB = require('./config/db');
const booksRoute = require('./routes/booksRoute');

connectDB();


const PORT = 8081;

app.use(express.urlencoded({extended :true}));
app.set('view engine','ejs');

app.listen(PORT, ()=>{
    console.log(`Server Started On http://localhost:${PORT}`);
})

app.use('/', booksRoute);

app.use(express.static("public"));