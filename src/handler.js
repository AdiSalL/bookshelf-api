const nanoid = require("nanoid");
const books = require("./books");
const addBooks = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage, 
        reading,
    } = request.payload;

    const id = nanoid(8)
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString;
    const updatedAt = insertedAt;

    const newBooks = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    }
    books.push(newBooks);

    const hasValidName = books.filter(book => book.name && book.name.trim() !== "");

    if(!hasValidName) {
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }   

    if(books.every(book => book.pageCount > book.readPage)) {
        const response = h.response({
                "status": "fail",
                "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if(isSuccess) {
        const response = h.response({
            "status": "success",
            "message": "Buku berhasil ditambahkan",
            "data": {
                bookId: id
                }
            });
        response.code(201);
        return response;
    }

}

module.exports = {addBooks};