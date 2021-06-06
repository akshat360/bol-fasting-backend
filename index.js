const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const cors = require('cors');

const { connectDB } = require('./config/db');

const authRouter = require('./routes/auth');
const fastRouter = require('./routes/fast');

const app = express();
const PORT = process.env.PORT || 5000;
// To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// To parse cookies from the HTTP Request
app.use(
  session({
    // It holds the secret key for session
    secret: 'bolt-fasting',

    // Forces the session to be saved
    // back to the session store
    resave: true,

    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true,
  })
);
morgan('dev');

app.use(cookieParser());
// Our requests hadlers will be implemented here...
connectDB();

app.get('/', (req, res) => {
  return res.end('hello to Bolt Fasting');
});

app.use('/api/auth', authRouter);
app.use('/api/fasts', fastRouter);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
