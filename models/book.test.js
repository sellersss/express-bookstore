process.env.NODE_ENV = "test";

const request = require("supertest");
const db = require("../db")
const app = require("../app")
const Book = require("./book")

describe("Test Book partial update function", function() {
  beforeEach(async function() {
    await db.query("DELETE FROM books")
    let b = await Book.create({
      "isbn": "12345",
      "amazon_url": "www.testbook.com",
      "author": "Test Testy",
      "language": "english",
      "pages": 400,
      "publisher": "Penguin",
      "title": "The little test that could",
      "year": 2020
    });
  });

  test("should update a book given partial information", async function() {
    let result = await request(app)
      .patch("/books/12345")
      .send({
        "author": "John Smith",
        "year": 1990
      });
    expect(result.body.book.year).toEqual(1990)
    expect(result.body.book.author).toEqual("John Smith")
    expect(result.body.book.title).toEqual("The little test that could")
  });

  test("400 if an invalid field is given", async function() {
    let result = await request(app)
      .patch("/books/12345")
      .send({
        "not_a_field": "John Smith",
        "year": 1990
      });
    expect(result.statusCode).toEqual(400)
  });
})
