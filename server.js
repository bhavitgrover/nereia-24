require('dotenv').config()

const express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    flash = require('express-flash'),
    passportInit = require('./utils/passport-config'),
    { ensureAuthenticated, forwardAuthenticated } = require('./utils/authenticate'),
    PORT = process.env.PORT || 5000,
    bodyParser = require('body-parser'),
    engine = require('ejs-blocks'),
    http = require('http'),
    socketIo = require('socket.io'),
    path = require('path'),
    app = express()

const server = http.createServer(app); // Create HTTP server
const io = socketIo(server); // Attach Socket.IO to the server

const indexRouter = require('./routers/indexRouter'),
      loginRouter = require('./routers/loginRouter'),
      registerRouter = require('./routers/registerRouter'),
      chatRouter = require('./routers/chatRouter'),
      discoveriesRouter = require('./routers/discoveriesRouter'),
      cliRouter = require('./routers/cliRouter');

app.use(express.static('public'))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: true }));
passportInit(passport)
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(process.env.MONGO_URI, console.log('MONGODB CONNECTED'))


app.use('/', indexRouter)
app.use('/login', forwardAuthenticated, loginRouter)
app.use('/register', forwardAuthenticated, registerRouter)
app.use('/chat', ensureAuthenticated, chatRouter)
app.use('/discoveries', ensureAuthenticated, discoveriesRouter)
app.use('/cli', ensureAuthenticated, cliRouter)


app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) console.log(err)
        return res.redirect('/login')
    });
})


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (message) => {
        console.log('message sent')
        io.emit('receiveMessage', message); // Broadcast message to all connected clients
        console.log('receive signal sent')
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, console.log(`Server listening on port ${PORT}`))
