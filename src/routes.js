const {addBooks, getBooks, getBooksId, updateBook, deleteBook} = require("./handler");

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
    },
    {
        method: "DELETE",
        path: "/books/{bookId}",
        handler: deleteBook
    },

]

module.exports = routes;