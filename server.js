/** Server for bookstore. */


const app = require("./app");

app.listen(3000, () => {
  console.log(`Server starting on port 3000 -> http://localhost:3000`);
});
