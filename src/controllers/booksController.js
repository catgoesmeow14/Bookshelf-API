import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../services/bookService.js';

async function addBookHandler(request, h) {
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

  // Validate input
  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  // Try to add the book
  try {
    const bookId = await addBook(request.payload); // Call the imported function directly
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: { bookId },
      })
      .code(201);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return h.response({ status: 'fail', message: error.message }).code(500);
  }
}

// getAllBooksHandler is simplified, as there's no need for await with a synchronous operation.
async function getAllBooksHandler(request, h) {
  const { reading, finished, name } = request.query;

  // Call getAllBooks with the appropriate query parameters
  const books = getAllBooks({ reading, finished, name });

  // Respond with the filtered books. Do not slice here as we want all matched books.
  return h.response({ status: 'success', data: { books } }).code(200);
}

async function getBookByIdHandler(request, h) {
  try {
    const book = getBookById(request.params.bookId); // Removed await since getBookById is not an async function.
    if (!book) {
      return h
        .response({
          status: 'fail',
          message: 'Buku tidak ditemukan', // Ensure this message is exactly as expected by the test.
        })
        .code(404);
    }
    // Ensure that the book object contains all required properties.
    // If the test expects specific properties, ensure they are present.
    return h.response({ status: 'success', data: { book } }).code(200);
  } catch (error) {
    return h.response({ status: 'fail', message: error.message }).code(500);
  }
}

// The service functions look correct. Just ensure that the filter conditions
// and the properties of books returned in getAllBooks match what the test cases expect.

// The updateBookHandler should check if the book exists and handle not found case.
async function updateBookHandler(request, h) {
  const { bookId } = request.params;
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

  // Validate input
  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  try {
    const bookExists = getBookById(bookId);
    if (!bookExists) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    }

    const updatedBook = await updateBook(bookId, request.payload);
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
  } catch (error) {
    return h.response({ status: 'fail', message: error.message }).code(500);
  }
}

async function deleteBookHandler(request, h) {
  try {
    const bookExists = getBookById(request.params.bookId); // Check if the book exists.
    if (!bookExists) {
      return h
        .response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        }) // Make sure the message is exactly as expected by the test
        .code(404);
    }
    await deleteBook(request.params.bookId); // Call the imported function directly.
    return h
      .response({ status: 'success', message: 'Buku berhasil dihapus' }) // Again, ensure the message matches the expected string
      .code(200);
  } catch (error) {
    // It's good practice to use specific error handling for known error types.
    return h
      .response({ status: 'fail', message: error.message })
      .code(
        error.message === 'Buku gagal dihapus. Id tidak ditemukan' ? 404 : 500
      ); // Use the same message for consistency.
  }
}

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
};
