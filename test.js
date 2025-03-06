import needle from 'needle';

// test codes for post and get functions

needle.post(
    'http://localhost:3000/add-book',
    { book_name: 'Harry Potter and the Philosopher’s Stone', isbn: '978-0-7475-3269-9', author: 'J.K Rowling', year_published: '1997'}, // can be an object or a string
    (err, res) => {
        // console.log(res.body);
    }
);

needle.post(
    'http://localhost:3000/add-book',
    { book_name: 'Harry Potter and the Chamber of Secrets', isbn: '0-7475-3849-2', author: 'J.K Rowling', year_published: '1998'}, // can be an object or a string
    (err, res) => {
        // console.log(res.body);
    }
);

needle.post(
    'http://localhost:3000/add-book',
    { book_name: 'The Little Prince', isbn: '978-0156012195', author: 'Antoine Saint-Exupery', year_published: '1943'}, // can be an object or a string
    (err, res) => {
        // console.log(res.body);
    }
);

needle.get('http://localhost:3000/find-by-isbn-author?isbn=978-0-7475-3269-9&author=J.K+Rowling', // can be an object or a string
    (err, res) => {
    // console.log(res.body);
});

needle.get('http://localhost:3000/find-by-author?author=J.K+Rowling', // can be an object or a string
    (err, res) => {
    // console.log(res.body);
});