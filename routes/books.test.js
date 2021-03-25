process.env.NODE_ENV = "test";

const request = require("supertest")

const app = require("../app")
const db = require("../db")
const Book = require("../models/book")

describe("Book Routes Test", function() {

  beforeEach(async function() {
    await db.query("DELETE FROM books");

    let b1 = await Book.create({
      "isbn": "0691161518",
      "amazon_url": "http://a.co/eobPtX2",
      "author": "Matthew Lane",
      "language": "english",
      "pages": 264,
      "publisher": "Princeton University Press",
      "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
      "year": 2019
    });
  });

  /** GET /books  => {books: [book, ...])*/

  test("can get a list of books", async function() {
    let response = await request(app)
      .get("/books")

    expect(response.body).toEqual({
      "books": [{
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2019
      }]
    });
  });

  // describe("GET /books/:id", function() {
  test("can get a single book by isbn", async function() {
    let response = await request(app)
      .get("/books/0691161518")

    expect(response.body).toEqual({
      "book": {
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2019
      }
    });
  });

  test("404 if book does not exist with isbn", async function() {
    let response = await request(app)
      .get("/books/1234")

    expect(response.statusCode).toEqual(404)
  });
});

describe("POST /books", function() {
  test("adds a book to the db", async function() {
    let response = await request(app)
      .post("/books")
      .send({
        "isbn": "123456789",
        "amazon_url": "http://abc123.com",
        "author": "Test Testy",
        "language": "english",
        "pages": 365,
        "publisher": "Testington",
        "title": "The Ultimate Integration Test",
        "year": 2020
      });

    expect(response.body).toEqual({
      "book": {
        "isbn": "123456789",
        "amazon_url": "http://abc123.com",
        "author": "Test Testy",
        "language": "english",
        "pages": 365,
        "publisher": "Testington",
        "title": "The Ultimate Integration Test",
        "year": 2020
      }
    });
  });

  test("400 error if parameter left out", async function() {
    let response = await request(app)
      .post("/books")
      .send({
        "book": {
          "isbn": "123456789",
          "author": "Test Testy",
          "language": "english",
          "pages": 365,
          "publisher": "Testington",
          "title": "The Ultimate Integration Test",
          "year": 2020
        }
      });
    expect(response.statusCode).toEqual(400)
  });

  test("400 error if variable TYPE is wrong", async function() {
    let response = await request(app)
      .post("/books")
      .send({
        "isbn": 123456789,
        "amazon_url": "http://abc123.com",
        "author": "Test Testy",
        "language": "english",
        "pages": 365,
        "publisher": "Testington",
        "title": "The Ultimate Integration Test",
        "year": 2020
      });
    expect(response.statusCode).toEqual(400)
  });

  test("400 error if amazon_url not URL", async function() {
    let response = await request(app)
      .post("/books")
      .send({
        "isbn": "123456789",
        "amazon_url": "gnmjagagaggsgd",
        "author": "Test Testy",
        "language": "english",
        "pages": 365,
        "publisher": "Testington",
        "title": "The Ultimate Integration Test",
        "year": 2020
      });
    expect(response.statusCode).toEqual(400)
  });

  test("400 error if invalid future year", async function() {
    let response = await request(app)
      .post("/books")
      .send({
        "isbn": "123456789",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Test Testy",
        "language": "english",
        "pages": 365,
        "publisher": "Testington",
        "title": "The Ultimate Integration Test",
        "year": 2035
      });
    expect(response.statusCode).toEqual(400)
  });

});

describe("PUT /:isbn", function() {
  test("update book data", async function() {
    let response = await request(app)
      .put("/books/0691161518")
      .send({
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "John Smith",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2019
      });
    expect(response.body).toEqual({
      "book": {
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "John Smith",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2019
      }
    })
  });

  test("400 error if field not valid", async function() {

    let response = await request(app)
      .put("/books/0691161518")
      .send({
        "isbn": "0691161518",
        "bad_field": "NOPE",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "John Smith",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2019
      });
    expect(response.statusCode).toEqual(400)
  })
});

describe("DELETE /isbn", function() {
  test("delete a book with the give isbn", async function() {
    let response = await request(app)
      .delete("/books/0691161518")

    expect(response.body).toEqual({ message: "Book deleted" })
  });

  test("404 error if book cannot be found", async function() {
    await request(app).delete("/books/0691161518")
    let response = await request(app).delete("/books/0691161518")

    expect(response.statusCode).toEqual(404)
  })
})

afterAll(async function() {
  await db.end();
})
