import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/find-by-isbn-author', (req, res) => {
    const { isbn, author } = req.query;

    if (!fs.existsSync('books.txt')) {
        return res.status(404).send({ success: false });
    }

    fs.readFile('books.txt', 'utf8', function read(err, data) {
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false });
        }

        let lines = data.split('\n');
        let found_book = [];

        for (const line of lines) {
            if (line === '') continue; 

            const [line_book_name, line_isbn, line_author, line_year_published] = line.split(',');

            if (isbn === line_isbn && author === line_author) {
                found_book.push({ 
                    book_name: line_book_name, 
                    isbn: line_isbn, 
                    author: line_author, 
                    year_published: line_year_published 
                });
            }
        }

        if (found_book.length === 0) {
            return res.status(404).send({ success: false });
        }

        return res.status(200).send({ book: found_book });
    });
});

app.get('/find-by-author', (req, res) => {
    const { isbn, author } = req.query;

    if (!fs.existsSync('books.txt')) {
        return res.status(404).send({ success: false });
    }

    fs.readFile('books.txt', 'utf8', function read(err, data) {
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false });
        }

        let lines = data.split('\n');
        let found_books = [];

        for (const line of lines) {
            if (line === '') continue;

            const [line_book_name, line_isbn, line_author, line_year_published] = line.split(',');

            if (author === line_author) {
                found_books.push({ 
                    book_name: line_book_name, 
                    isbn: line_isbn, 
                    author: line_author, 
                    year_published: line_year_published 
                });
            }
        }

        if (found_books.length === 0) {
            return res.status(404).send({ success: false });
        }

        return res.status(200).send({ books: found_books });
    });
});


app.post('/add-book', (req, res) => {
    const { book_name, isbn, author, year_published } = req.body;
    const book_info = `${book_name},${isbn},${author},${year_published}\n`;

    if (!book_name || !isbn || !author || !year_published) {
        console.log({ success: false });
        return res.status(400).send({ success: false });
    }

    if (!fs.existsSync('books.txt')) {
        fs.appendFile('books.txt', book_info, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send({ success: false });
            }
            console.log({ success: true });
            return res.status(200).send({ success: true });
        });
    }

    fs.readFile('books.txt', 'utf8', function read(err, data) {
        if (err) {
            console.error(err);
            return res.status(500).send({ success: false });
        }

        const lines = data.split('\n');
        const isbn_list = [];

        for (const line of lines) {
            if (line === '') continue;

            const [, line_isbn] = line.split(','); 
            isbn_list.push(line_isbn);
        }

        console.log(isbn_list);

        if (isbn_list.includes(isbn)) {
            console.log({ success: false });
            return res.status(500).send({ success: false });
        } else {
            fs.appendFile('books.txt', book_info, function (err) {
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



