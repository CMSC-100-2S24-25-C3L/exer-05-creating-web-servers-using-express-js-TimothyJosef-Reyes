import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/find-by-isbn-author', (req, res) => {
    const {isbn, author} = req.query;
    
    fs.readFile('books.txt', 'utf8', function read(err, data) {
        if (err) {
          console.error(err);
          return;
        }

        let lines = data.split('\n');
        let found_books = [];

        for (const line of lines) {
            if (line === '') continue; // Skip empty lines

            const [line_book_name, line_isbn, line_author, line_year_published] = line.split(',');

            if(isbn == line_isbn && author == line_author){
                found_books.push(line);
            }
        }

        res.send(found_books);
    });
});

app.get('/find-by-author', (req, res) => {
    const {author} = req.query;

    fs.readFile('books.txt', 'utf8', function read(err, data) {
        if (err) {
          console.error(err);
          return;
        }

        let lines = data.split('\n');
        let found_books = [];

        for (const line of lines) {
            if (line === '') continue; // Skip empty lines

            const [line_book_name, line_isbn, line_author, line_year_published] = line.split(',');

            if(author == line_author){
                found_books.push(line);
            }
        }

        res.send(found_books);
    });
});

app.post('/add-book', (req, res) => {
    const {book_name, isbn, author, year_published} = req.body;
    const book_info  = `${book_name},${isbn},${author},${year_published}\n`;
    if(!book_name|| !isbn || !author || !year_published){
        console.log(`{ success: false }`);
    } else {
        console.log(`{ success: true }`);
        fs.appendFile('books.txt', book_info, function (err) {
            if (err) throw err;
        });
        res.send(`Received book: ${book_name}, ISBN: ${isbn}, Author: ${author}, Year: ${year_published}`);
    }
});

app.listen(3000, () => { 
    console.log('Server started at port 3000')
});



