const movieSchema = require("../model/movieSchema");
const fs = require("fs");
const path = require("path");

const featuredMovies = [
    {
        _id: "featured-1",
        name: "WrestleMania Reigns vs Punk",
        image: "/images/1.webp",
        desc: "A high-voltage wrestling showdown between Roman Reigns and CM Punk at WrestleMania.",
        category: "Action",
        rating: 8.5,
        year: "2024",
        isTrending: true
    },
    {
        _id: "featured-2",
        name: "Dhurandhar",
        image: "/images/2.webp",
        desc: "An intense action drama featuring a fearless warrior on a mission of revenge.",
        category: "Drama",
        rating: 7.8,
        year: "2023",
        isTrending: true
    },
    {
        _id: "featured-3",
        name: "Yeh Meri Family Youth",
        image: "/images/3.webp",
        desc: "A light-hearted coming-of-age story about friendship, love, and youth.",
        category: "Comedy",
        rating: 7.5,
        year: "2022",
        isTrending: true
    },
    {
        _id: "featured-4",
        name: "Border 2",
        image: "/images/4.webp",
        desc: "A patriotic war drama showcasing bravery and sacrifice on the battlefield.",
        category: "Action",
        rating: 8.2,
        year: "2024",
        isTrending: true
    }
];

module.exports.getHomePage = async (req, res) => {
    try {
        const dbMovies = await movieSchema.find({ isTrending: true }).limit(6).lean();
        const movies = featuredMovies.concat(dbMovies);
        console.log('featuredMovies:', featuredMovies);
        res.status(200).render("pages/home", {
            movies
        });
    } catch (error) {
        console.log(error);
        res.status(200).render("pages/home", {
            movies: featuredMovies
        });
    }
};

module.exports.getMovie = async(req,res)=>{
    try {
        const movies = await movieSchema.find().lean();
        console.log('getMovie called, movies:', movies);
        res.status(200).render("pages/viewMovies", {
            movies
        });
    } catch (error) {
        console.log(error);
        res.status(200).render("pages/viewMovies", {
            movies: []
        });
    }
};

module.exports.getSingleMovie = async (req, res) => {
    try {
        let movie;
        if (req.params.id.startsWith('featured-')) {
            const index = parseInt(req.params.id.split('-')[1]) - 1;
            movie = featuredMovies[index];
        } else {
            movie = await movieSchema.findById(req.params.id);
        }
        if (!movie) {
            return res.status(404).send("Movie not found");
        }
        res.status(200).render("pages/singleMovie", { movie });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};

module.exports.getAddMoviePage = (req, res) => {
    res.status(200).render("pages/addMovie", {
        submitted: req.query.submitted === "true"
    });
};

module.exports.addMovie = async (req, res) => {
    try {
        const { name, image, desc, category, rating, year } = req.body;
        const newMovie = new movieSchema({
            name,
            image : req.file ? req.file.filename : null,
            desc,
            category,
            rating: parseFloat(rating),
            year: parseInt(year),
            isTrending: true
        });
        await newMovie.save();
        res.redirect("/movies/add?submitted=true");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding movie");
    }
};

module.exports.getEditMoviePage = async (req, res) => {
    try {
        const movie = await movieSchema.findById(req.params.id);
        if (!movie) {
            return res.status(404).send("Movie not found");
        }
        res.status(200).render("pages/editMovie", { movie });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};

module.exports.editMovie = async (req, res) => {
    try {
        const movie = await movieSchema.findById(req.params.id);

        if (!movie) {
            return res.status(404).send("Movie not found");
        }

        const { name, desc, category, rating, year, isTrending } = req.body;

        if (req.file) {

            if (movie.image) {
                const oldImagePath = path.join(__dirname, "../public/uploads/", movie.image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            movie.image = req.file.filename;
        }

        movie.name = name;
        movie.desc = desc;
        movie.category = category;
        movie.rating = parseFloat(rating);
        movie.year = parseInt(year);
        movie.isTrending = isTrending === "true";

        await movie.save();

        res.redirect("/movies/view");

    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating movie");
    }
};

module.exports.deleteMovie = async (req, res) => {
    try {
        const movie = await movieSchema.findById(req.params.id);

        if (movie && movie.image) {
            const imgPath = path.join(__dirname, "../public/uploads/", movie.image);

            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        }

        await movieSchema.findByIdAndDelete(req.params.id);

        res.redirect("/movies/view");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting movie");
    }
};
