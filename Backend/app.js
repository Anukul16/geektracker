// const express = require('express');
// const app = express();
// require('dotenv').config();
// const port = process.env.PORT  ;
// const cors = require('cors');
// const userNameRoute = require('./Routes/UsernameRoute')
// // const mainRoute = require('../Backend/Routes/MainRoute')
// const captureSS = require('../Backend/Routes/Screenshot')

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use('/api',userNameRoute)
// // app.use('/api',mainRoute)
// app.use('/api',captureSS)



// app.get('/', (req, res) => {
//   res.send('Hello, Express!');
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT  ;
const cors = require('cors');
const userNameRoute = require('./Routes/UsernameRoute')
// const mainRoute = require('../Backend/Routes/MainRoute')
const captureSS = require('../Backend/Routes/Screenshot')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with the specific origin(s) you want to allow
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, userNameRoute);
app.use('/api',captureSS)



app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

