import { nanoid } from 'nanoid';

import books from '../models/Book.js';

function addBook(bookData) {
  if (!bookData.name) {
    throw new Error('Gagal menambahkan buku. Mohon isi nama buku');
  }
  if (bookData.readPage > bookData.pageCount) {
    throw new Error(
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    );
  }

  const newBook = {
    id: nanoid(),
    ...bookData,
    finished: bookData.pageCount === bookData.readPage,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add the new book to the array
  books.push(newBook);
  return newBook.id; // Just return the book ID
}

function getAllBooks({ reading, finished, name } = {}) {
  let filteredBooks = books;

  // Convert the query parameters to the expected type (boolean).
  const isReading = reading === '1';
  const isFinished = finished === '1';

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Convert each book to the expected response format
  return filteredBooks.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));
}

function getBookById(bookId) {
  return books.find((b) => b.id === bookId);
}

function updateBook(bookId, updateData) {
  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex === -1) {
    throw new Error('Gagal memperbarui buku. Id tidak ditemukan');
  }
  const updatedBook = {
    ...books[bookIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
    // Ensure to calculate 'finished' based on the updated pageCount and readPage
    finished: updateData.readPage === updateData.pageCount,
  };
  books[bookIndex] = updatedBook;
  return updatedBook;
}

function deleteBook(bookId) {
  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex === -1) {
    throw new Error('Buku gagal dihapus. Id tidak ditemukan'); // Update the message here to match the expected output
  }
  books.splice(bookIndex, 1);
}

export { addBook, getAllBooks, getBookById, updateBook, deleteBook };
