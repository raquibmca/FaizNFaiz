require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const path = require("path");
// const dbservice = require('./service/dbservice');

const auth = require('./routes/auth');
const address = require('./routes/useraddress');
const user = require('./routes/user');
const order = require('./routes/order');
const item = require('./routes/item');
const category = require('./routes/category');
const dashboard = require('./routes/dashboard');
// const cors = require('cors')

// app.use(cors());
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(helmet());
app.use(morgan('API :method :url, Status :status, Length :res[content-length] - Time :response-time ms'));

app.use('/api/auth', auth);
app.use('/api/address', address);
app.use('/api/user', user);
app.use('/api/order', order);
app.use('/api/item', item);
app.use('/api/category', category);
app.use('/api/dashboard', dashboard);

app.get('/', (req, res) => {
  res.send();
})

app.listen(process.env.PORT, () => {
  console.log(`Listing the port ${process.env.PORT}...`);
})