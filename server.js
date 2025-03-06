import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/find-by-isbn-author', (req, res) => {
    const {isbn, author} = req.query;
    console.log(req.query)
    fs.readFile('books.txt', 'utf8', function read(err, data) {
        if (err) {
          console.error(err);
          return;
        }

        let parts = data.split(',');
        
        if (parts[1] == isbn || [parts[2]] == author){
            console.log(data);
        }
    });
});

app.get('/find-by-author', (req, res) => {
    const {author} = req.query;
    console.log(req.query)
    fs.readFile('books.txt', 'utf8', function read(err, data) {
        if (err) {
          console.error(err);
          return;
        }

        let parts = data.split(',');
        
        if ([parts[2]] == author){
            console.log(data);
        }
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



