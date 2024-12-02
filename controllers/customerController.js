const db = require("../db/setup");
const getCustomers = (req, res) => {
  db.all("SELECT * FROM Customer", [], (err, rows) => {
    if (err) {
      console.log("Error sending all customers.");
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("All customers sent.");
    res.json({ users: rows });
  });
};

module.exports = {
  getCustomers,
};
