const express = require ('express');
const mongoose = require ('mongoose');
const app = express();
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const reactionsRoutes = require('./routes/reactions');
const reportsRoutes = require('./routes/reports');
const path = require ('path');

app.use (express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect('mongodb+srv://Picaljean:Picaljean@cluster0.ydibcla.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('Vous êtes bien connectés à MungoDB !'))
  .catch(() => console.log('Échec de la connexion à MungoDB'));

app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;