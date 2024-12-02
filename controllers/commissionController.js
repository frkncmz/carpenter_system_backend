const db = require("../db/setup");
const getCommissions = (req, res) => {
  db.all("SELECT * FROM Commission", [], (err, rows) => {
    if (err) {
      console.log("Error sending all commissions.");
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("All commissions sent.");
    res.json({ users: rows });
  });
};

module.exports = {
  getCommissions,
};
