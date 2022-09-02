require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const {
  User, Sequelize, Stat,
} = require('./db/models');

const app = express();

app.use(cors({
  credentials: true,
  origin: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(process.env.PWD, 'public')));

const sessionConfig = {
  name: 'mega-cookie',
  secret: process.env.SECRET || 'thisisnotsecure',
  store: new FileStore(),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
  resave: true,
  saveUninitialized: false,
};

app.use(session(sessionConfig));

app.post('/auth', async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findOne({ where: { name } });
    if (user) {
      req.session.userName = user.name;
      req.session.userId = user.id;
      return res.json(user);
    }
    const newUser = await User.create(
      { name },
    );

    if (newUser.id) {
      req.session.userName = newUser.name;
      req.session.userId = newUser.id;
      return res.json(newUser);
    }

    return res.json({});
  } catch (error) {
    return res.json(error);
  }
});

app.get('/auth', async (req, res) => {
  try {
    const result = await User.findByPk(req.session.userId);
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

app.get('/logout', async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie('mega-cookie');
    res.sendStatus(200);
  } catch (error) {
    res.json(error);
  }
});

app.post('/stat', async (req, res) => {
  try {
    const result = await Stat.findOne({ where: { uid: req.session.userId } });
    result.score += req.body;
  } catch (error) {
    res.json(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log('server start ', process.env.PORT);
});
