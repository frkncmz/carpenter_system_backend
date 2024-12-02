const db = require("../db/setup");
const getStocks = (req, res) => {
  db.all("SELECT * FROM Stock", [], (err, rows) => {
    if (err) {
      console.log("Error sending all stocks.");
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("All stock sent.");
    res.json({ users: rows });
  });
};

module.exports = {
  getStocks,
};
