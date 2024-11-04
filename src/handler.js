const {nanoid} = require("nanoid");
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

    const id = nanoid();
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

    if(hasValidName) {
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }   

    if(books.every(book => book.pageCount < book.readPage)) {
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

};

const getBooks = () => ({
    status: "success",
    data: {
        books: books.length > 0 ? 
        books.map(book => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
        })) : []
    }
})

const getBooksId = (request, h) => {
    const { bookId } = request.params;
    const book = books.find((book) => book.id === bookId);

    if (book) {
        return {
            status: "success",
            data: {
                book,
            },
        };
    } else {
        const response = h.response({
            status: "fail",
            message: "Buku tidak ditemukan",
        });
        response.code(404);
        return response;
    }
};


const updateBook = (request, h) => {
    const {bookId} = request.params;
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

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);
    
    if(!name) {
        return h.response({
            status: "fail",
            message:  "Gagal memperbarui buku. Mohon isi nama buku"
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    if(index !== -1 ) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage, 
            reading,
            updatedAt
        }
        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui"
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan"
    });
    response.code(404);
    return response;

}

const deleteBook = (request, h) => {
    const {bookId} = request.params;
    const book = books.findIndex(book => book.id == bookId);

    if(book){
        books.splice(book, 1);
        return h.response({
            status: "success",
            message :"Buku berhasil dihapus"
        }).code(200);
    }
    return h.response({
        status: "fail",
        message :`Buku gagal dihapus. ${bookId} tidak ditemukan`
    }).code(404);
}

module.exports = {addBooks, getBooks, getBooksId, updateBook, deleteBook};