const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

const productManager = new ProductManager('products.json');

// Middleware para parsear JSON
app.use(express.json());

// Endpoint para obtener todos los productos
app.get('/products', (req, res) => {
  try {
    let products = productManager.getProducts();
    const limit = parseInt(req.query.limit);
    if (!isNaN(limit)) {
      products = products.slice(0, limit);
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un producto por ID
app.get('/products/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

