import express from 'express'; // neccessary libraries
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/find-by-isbn-author', (req, res) => { // allows the user to get books based on isbn and author
    const { isbn, author } = req.query; // isbn and author are taken from request query

    if (!fs.existsSync('books.txt')) { // informs user that the books.txt does not exist
        return res.status(404).send({ success: false });
    }

    fs.readFile('books.txt', 'utf8', function read(err, data) { // reads through the books.txt file
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false });
        }

        let lines = data.split('\n'); // splits the lines of the file
        let found_book = [];

        for (const line of lines) { // goes through each line
            if (line === '') continue; 

            const [line_book_name, line_isbn, line_author, line_year_published] = line.split(',');

            if (isbn === line_isbn && author === line_author) { // appends the book if it matches with the isbn and author
                found_book.push({ 
                    book_name: line_book_name, 
                    isbn: line_isbn, 
                    author: line_author, 
                    year_published: line_year_published 
                });
            }
        }

        if (found_book.length === 0) { // informs the user if the book does not exist
            return res.status(404).send({ success: false });
        }

        return res.status(200).send({ book: found_book }); // returns the found book
    });
});

app.get('/find-by-author', (req, res) => { // finds books based on author
    const { author } = req.query;

    if (!fs.existsSync('books.txt')) { // informs user if the books.txt does not exist
        return res.status(404).send({ success: false });
    }

    fs.readFile('books.txt', 'utf8', function read(err, data) { // reads through books.txt
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false });
        }

        let lines = data.split('\n'); // splits data by line
        let found_books = [];

        for (const line of lines) { // goes through each line
            if (line === '') continue;

            const [line_book_name, line_isbn, line_author, line_year_published] = line.split(',');

            if (author === line_author) { // appends the books if they have matching author
                found_books.push({ 
                    book_name: line_book_name, 
                    isbn: line_isbn, 
                    author: line_author, 
                    year_published: line_year_published 
                });
            }
        }

        if (found_books.length === 0) { // informs user that the author has no books
            return res.status(404).send({ success: false });
        }

        return res.status(200).send({ books: found_books }); // returns all the books of the author
    });
});


app.post('/add-book', (req, res) => { // function to add books to the books.txt
    const { book_name, isbn, author, year_published } = req.body;
    const book_info = `${book_name},${isbn},${author},${year_published}\n`;

    if (!book_name || !isbn || !author || !year_published) { // makes sure that each field is filled in
        console.log({ success: false });
        return res.status(400).send({ success: false });
    }

    if (!fs.existsSync('books.txt')) { // just places a book into books.txt if the file does not exist yet
        return fs.appendFile('books.txt', book_info, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send({ success: false });
            }
            console.log({ success: true });
            return res.status(200).send({ success: true });
        });
    }

    fs.readFile('books.txt', 'utf8', function read(err, data) { // used for checking of duplicate isbn
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false });
        }

        const lines = data.split('\n');
        const isbn_list = [];

        for (const line of lines) { // goes through each line
            if (line === '') continue;

            const [, line_isbn] = line.split(','); 
            isbn_list.push(line_isbn);
        }

        console.log(isbn_list);

        if (isbn_list.includes(isbn)) { // if isbn is matching with previous book, the book willnot be added
            console.log({ success: false });
            return res.status(500).send({ success: false });
        } else {
            fs.appendFile('books.txt', book_info, function (err) { // appends the book if all criteria is cleared
                if (err) {
                    console.error(err);
                    return res.status(500).send({ success: false });
                }
                console.log({ success: true });
                return res.status(200).send({ success: true });
            });
        }
    });
});


app.listen(3000, () => { 
    console.log('Server started at port 3000')
});