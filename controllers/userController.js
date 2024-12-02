const db = require("../db/setup");
const getUsers = (req, res) => {
  db.all("SELECT * FROM User", [], (err, rows) => {
    if (err) {
      console.log("Error sending all users.");
      res.status(500).json({ error: err.message });
      return;
    }
    console.log("All users sent.");
    res.json({ users: rows });
  });
};

module.exports = {
  getUsers,
};
