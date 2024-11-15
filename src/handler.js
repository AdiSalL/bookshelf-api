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

    //membuat  id 
    const id = nanoid();
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
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


    if(!name || name.trim() === "") {
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }if(readPage > pageCount) {
        const response = h.response({
                "status": "fail",
                "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }

        books.push(newBooks);
        const response = h.response({
            "status": "success",
            "message": "Buku berhasil ditambahkan",
            "data": {
                bookId: id
                }
            });
        response.code(201);
        return response;


};

const getBooks = (request, h) => { 
    const { name, reading, finished } = request.query;

    if(name || reading || finished){
    let filteredBooks = books;
    if(reading) {
        if(reading === "1"){ 
            filteredBooks = filteredBooks.filter(book => book.reading === true);
            const response = h.response({
                status: "success",
                data: filteredBooks
            });
            response.code(200);
            return response;
        }else if(finished === "0") {
            filteredBooks = filteredBooks.filter(book => book.reading === false);
            const response = h.response({
                status: "success",
                data: filteredBooks
            });
            response.code(200);
            return response;
        }else {
            const response = h.response({
                status: "fail",
                message: `Tidak ada data yang cocok`
                });
                response.code(400);
                return response;
        }
    }else if(finished) {
        if(finished === "1") {
            filteredBooks = filteredBooks.filter(book => book.finished === true);
            const response = h.response({
                status: "success",
                data: filteredBooks
            });
            response.code(200);
            return response;
        }else if(finished === "0"){
            filteredBooks = filteredBooks.filter(book => book.finished === false);
            const response = h.response({
                status: "success",
                data: filteredBooks
            });
            response.code(200);
            return response;
        }else{ 
            const response = h.response({
                status: "fail",
                message: `Gagal menemukan buku ${name}.`
                });
                response.code(400);
                return response;
        }

    }else if(name) {
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
        const response = h.response({
            status: "success",
            data: filteredBooks
        });
        response.code(200);
        return response;
    }else {
        const response = h.response({
            status: "fail",
            message: `Gagal menemukan buku ${name}.`
            });
            response.code(400);
            return response;
    }
    } else {
        const response = h.response({
            status: "success",
            data: {
                books: books.length > 0 
                    ? books.map(book => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
                    : []
            }
        });
        response.code(200);
        return response;
    }
};



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
    const book = books.findIndex(book => book.id === bookId);

    if(book === -1){
        return h.response({
            status: "fail",
            message :`Buku gagal dihapus. ${bookId} tidak ditemukan`
        }).code(404);
    }else {
        books.splice(book, 1);
        return h.response({
            status: "success",
            message :"Buku berhasil dihapus"
        }).code(200);
    }
}

module.exports = {addBooks, getBooks, getBooksId, updateBook, deleteBook};