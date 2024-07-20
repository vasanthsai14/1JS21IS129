const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const productRoutes = require('./routes/products');

app.use('/categories', productRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
