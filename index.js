const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load idea route
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Load passport config files
require('./config/passport')(passport);


mongoose.connect('mongodb://localhost/vidjotter', {
    useNewUrlParser: true
}).then(() => {
    console.log('MondoDB connected')
})


// Body-parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());


// Express handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Method Override middleware
app.use(methodOverride('_method'));

// Connect flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// Index route 
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title
    })
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.use(ideas)
app.use('/users', users)

const port = 4000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})