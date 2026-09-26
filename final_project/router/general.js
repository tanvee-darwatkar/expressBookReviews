// Task 5: Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matching_books = [];
  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      matching_books.push({
        isbn: isbn,
        author: books[isbn].author,
        title: books[isbn].title,
        reviews: books[isbn].reviews
      });
    }
  }
  res.send(JSON.stringify(matching_books, null, 4));
});
