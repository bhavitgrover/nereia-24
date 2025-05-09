require("dotenv").config();

const express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  session = require("express-session"),
  flash = require("express-flash"),
  passportInit = require("./utils/passport-config"),
  {
    ensureAuthenticated,
    forwardAuthenticated,
    ensureRole
  } = require("./utils/authenticate"),
  PORT = process.env.PORT || 5000,
  bodyParser = require("body-parser"),
  engine = require("ejs-blocks"),
  http = require("http"),
  socketIo = require("socket.io"),
  path = require("path"),
  MongoStore = require('connect-mongo'),
  app = express();
  
  
  const server = http.createServer(app);
  const io = socketIo(server);
  
  const indexRouter = require("./routers/indexRouter"),
  loginRouter = require("./routers/loginRouter"),
  registerRouter = require("./routers/registerRouter"),
  chatRouter = require("./routers/chatRouter"),
  discoveriesRouter = require("./routers/discoveriesRouter"),
  aiRouter = require("./routers/aiRouter"),
  auctionRouter = require("./routers/auctionRouter"),
  joinRouter = require("./routers/joinRouter"),
  neritRouter = require("./routers/neritRouter"),
  cliRouter = require("./routers/cliRouter"),
  sosRouter = require("./routers/sosRouter"),
  shopRouter = require("./routers/shopRouter");

mongoose.connect(process.env.MONGO_URI, console.log("MONGODB CONNECTED"));

app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
passportInit(passport);
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongooseConnection: mongoose.connection,
      ttl: 30 * 24 * 60 * 60
    }),
    cookie: {
      secure: 'auto',
      maxAge: 30 * 24 * 60 * 60 * 1000
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.use("/", indexRouter);
app.use("/login", forwardAuthenticated, loginRouter);
app.use("/register", forwardAuthenticated, registerRouter);
app.use("/chat", ensureAuthenticated, chatRouter);
app.use("/discoveries", ensureAuthenticated, discoveriesRouter);
app.use("/cli", ensureAuthenticated, cliRouter);
app.use("/ai", ensureAuthenticated, aiRouter);
app.use("/auction", ensureAuthenticated, auctionRouter);
app.use("/join", ensureAuthenticated, joinRouter);
app.use("/nerit", ensureAuthenticated, neritRouter);
app.use("/shop", ensureAuthenticated, ensureRole, shopRouter);
app.use("/sos", ensureAuthenticated, sosRouter);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    return res.redirect("/login");
  });
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("sendMessage", (message) => {
    console.log("message sent");
    io.emit("receiveMessage", message);
    console.log("receive signal sent");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
