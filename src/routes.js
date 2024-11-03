const {addBooks, getBooks, getBooksId, updateBook} = require("./handler");

const routes = [
    {
        method: "POST",
        path: "/books",
        handler: addBooks
    },
    {
        method: "GET",
        path: "/books",
        handler: getBooks,
    },
    {
        method: "GET",
        path: "/books/{bookId}",
        handler: getBooksId
    },
    {
        method: "PUT",
        path: "/books/{bookId}",
        handler: updateBook
    }
]

module.exports = routes;