/******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const pgSession = require("connect-pg-simple")(session);
const bodyParser = require("body-parser"); // ✅ Adicionado para ler body dos forms

const app = express();

const baseController = require("./controllers/baseController");
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities");
const pool = require("./database/");

/* ***********************
 * Middleware
 ************************/

// Session Middleware
app.use(
  session({
    store: new pgSession({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Middleware para definir a variável nav para todas as views
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Body-parser Middleware (essencial para ler dados do <form>)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-form-urlencoded

/* *****************************
 * View Engine and Templates
 *******************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // path relativo à pasta views
app.set("views", path.join(__dirname, "views")); // garante que o Express acha as views

/* ***********************
 * Static Routes
 *************************/
app.use(static);

/* ***********************
 * Routes
 *************************/

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

// File Not Found Route - deve estar após todas as rotas
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav(); // opcional, mas já temos nav em res.locals
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav, // ou res.locals.nav, se preferir
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
