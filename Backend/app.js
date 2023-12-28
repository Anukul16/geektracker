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
app.use(cors());
app.use('/api',userNameRoute)
// app.use('/api',mainRoute)
app.use('/api',captureSS)



app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
