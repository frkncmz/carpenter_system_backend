const express = require("express"); // server oluşturmak için
const cors = require("cors"); // Cross-Origin Resource Sharing güvenlik amaçlı
const session = require("express-session");
const app = express();
app.use(express.json()); // JSON verilerini almak için middleware
app.use(
  cors({
    origin: "http://localhost:5174", // İstemci etki alanını buraya ekleyin
    credentials: true, // Oturum çerezini göndermeyi etkinleştirin
  })
);
const db = require("./db/setup"); // setup.js dosyasını import et
const passport = require("passport");
const bcrypt = require("bcrypt");

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // HTTPS kullanıyorsanız true yapın
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

// Rotaları kullan
const userRoutes = require("./routes/user");
const stockRoutes = require("./routes/stock");
const customerRoutes = require("./routes/customer");
const commissionRoutes = require("./routes/commission");
const productRoutes = require("./routes/product");

app.use("/user", userRoutes);
app.use("/stock", stockRoutes);
app.use("/customer", customerRoutes);
app.use("/commission", commissionRoutes);
app.use("/product", productRoutes);

const port = 3002;

try {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
}

// server.js (devam)
const LocalStrategy = require("passport-local").Strategy;

// Kullanıcı stratejisi
passport.use(
  new LocalStrategy((username, password, done) => {
    db.get("SELECT * FROM User WHERE username = ?", [username], (err, user) => {
      if (err) return done(err);
      if (!user) {
        console.log("User not found.");

        return done(null, false, { message: "User not found." });
      }

      // Parolayı kontrol et
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) {
          console.log("Incorrect password.");
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Kullanıcıyı serileştirirken sadece ID'sini saklayın
});

passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM user WHERE user_id = ?", [id], (err, user) => {
    done(err, user); // Veritabanından kullanıcıyı alın
  });
});
