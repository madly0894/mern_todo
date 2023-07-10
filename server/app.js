require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./middlewares/auth.middleware');
// const cookieParser = require('cookie-parser')
// const multer  = require('multer');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
   cors({
      origin: process.env.CLIENT_URL,
   }),
);
// routers
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/employees', auth, require('./routes/employee.routes'));
// app.use(express.static('public'));
// app.use(multer({ dest: '/tmp/'}));
// app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
   app.use('/', express.static(path.join(__dirname, 'client', 'build')));

   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
   });
}

const port = process.env.PORT || 5000;

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Couldn't connect to server"));
db.once('open', () => console.log('Connected to MongoDB!'));

async function start() {
   try {
      await mongoose.connect(process.env.DB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      app.listen(port, () => console.log('Example app listening at http://%s:%s', port));
   } catch (e) {
      console.log('Server message', e.message);
      process.exit(1);
   }
}

start();
