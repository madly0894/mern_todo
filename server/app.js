require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
   }),
);
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use('/api', require('./routes'));
app.use(require('./middlewares/error.middleware'));

// if (process.env.NODE_ENV === 'production') {
//    app.use(express.static(path.join(__dirname, 'client', 'build')));
//
//    app.get('*', (req, res) => {
//       res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//    });
// }

const PORT = process.env.PORT || 5000;

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Couldn't connect to server"));
db.once('open', () => console.log('Connected to MongoDB!'));

process.on('exit', () => {
   console.log('exiting...');
   process.exit();
});

async function start() {
   try {
      await mongoose.connect(process.env.DB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
   } catch (e) {
      console.log('Server message', e.message);
      process.exit(1);
   }
}

start();
