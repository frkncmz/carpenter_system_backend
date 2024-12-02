const db = require("../db/setup");
const getProducts = (req, res) => {
  db.all("SELECT * FROM Product", [], (err, rows) => {
    if (err) {
      console.log("Error sending all products.");
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("All products sent.");
    res.json({ users: rows });
  });
};

module.exports = {
  getProducts,
};
