const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "../database.db"),
  (err) => {
    if (err) {
      console.error("Error opening database: " + err.message);
    } else {
      db.run("PRAGMA foreign_keys = ON;", (err) => {
        if (err) {
          console.error("Foreign keys ayarı yapılırken hata:", err.message);
        }
      });
      console.log("Database connected successfully");
    }
  }
);

db.serialize(() => {
  // Kullanıcı Tablosu

  db.run(`
      CREATE TABLE IF NOT EXISTS User (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        fullname TEXT NOT NULL,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        update_time TIMESTAMP,
        user_type TEXT NOT NULL   
      )
    `);
  // Stok tablosu
  db.run(`
        CREATE TABLE IF NOT EXISTS Stock (
          stock_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT,
          class TEXT,
          amount REAL DEFAULT 0,
          unit TEXT,
          unit_price REAL DEFAULT 0,
          time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          update_time TIMESTAMP
        )
      `);

  // Ürünler tablosu
  db.run(`
        CREATE TABLE IF NOT EXISTS Product (
          product_id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          type TEXT,
          rank TEXT,
          witdh REAL DEFAULT 0,
          height REAL DEFAULT 0,
          length REAL DEFAULT 0,
          amount REAL DEFAULT 0,
          volume REAL GENERATED ALWAYS AS (witdh * height * length / 1000000.0) STORED,
          time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          update_time TIMESTAMP
        )
      `);

  // Müşteri tablosu
  db.run(`
        CREATE TABLE IF NOT EXISTS Customer (
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        phone_number NUMBER,
        note TEXT
    )
      `);

  // Sipariş Tablosu

  db.run(`
      CREATE TABLE IF NOT EXISTS Commission (
      commission_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      customer_id INTEGER NOT NULL,
      type TEXT,
      rank TEXT,
      width REAL DEFAULT 0,
      height REAL DEFAULT 0,
      length REAL DEFAULT 0,
      amount REAL DEFAULT 0,
      volume REAL GENERATED ALWAYS AS (width * height * length / 1000000.0) STORED,
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      update_time TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
  )
    `);

  db.run(`

    CREATE TRIGGER IF NOT EXISTS update_time_user
      AFTER UPDATE ON User
      FOR EACH ROW
      BEGIN
        UPDATE User SET update_time = CURRENT_TIMESTAMP WHERE user_id = OLD.user_id;
      END;`);

  db.run(`

    CREATE TRIGGER IF NOT EXISTS update_time_stock
      AFTER UPDATE ON Stock
      FOR EACH ROW
      BEGIN
        UPDATE Stock SET update_time = CURRENT_TIMESTAMP WHERE stock_id = OLD.stock_id;
      END;`);
  db.run(`

    CREATE TRIGGER IF NOT EXISTS update_time_product
      AFTER UPDATE ON Product
      FOR EACH ROW
      BEGIN
        UPDATE Product SET update_time = CURRENT_TIMESTAMP WHERE product_id = OLD.product_id;
      END;`);
  db.run(`

    CREATE TRIGGER IF NOT EXISTS update_time_customer
      AFTER UPDATE ON Customer
      FOR EACH ROW
      BEGIN
        UPDATE Customer SET update_time = CURRENT_TIMESTAMP WHERE customer_id = OLD.customer_id;
      END;`);
  db.run(`

     CREATE TRIGGER IF NOT EXISTS update_time_commission
       AFTER UPDATE ON Commission
       FOR EACH ROW
       BEGIN
         UPDATE Commission SET update_time = CURRENT_TIMESTAMP WHERE commission_id = OLD.commission_id;
       END;`);
});

module.exports = db;
