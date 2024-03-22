const express = require('express');
const session = require('express-session');
// const passport = require('passport');
const router = require('./routes/index'); 
const Controller = require('./controllers/controller');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(router); 

app.listen(port, () => {
    console.log(`application is running on port ${port}`);
});
