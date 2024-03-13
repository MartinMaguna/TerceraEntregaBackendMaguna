const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.productIdCounter = 1;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.products = JSON.parse(data);
      if (!Array.isArray(this.products)) {
        this.products = [];
      }
      if (this.products.length > 0) {
        this.productIdCounter = Math.max(...this.products.map(product => product.id)) + 1;
      }
    } catch (err) {
      console.error('Error loading products:', err);
    }
  }

  saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.filePath, data);
    } catch (err) {
      console.error('Error saving products:', err);
    }
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos los campos son obligatorios");
    }

    if (this.products.some(product => product.code === code)) {
      throw new Error("El código del producto ya está en uso");
    }

    const newProduct = {
      id: this.productIdCounter++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    this.products[index] = { ...this.products[index], ...updatedFields };
    this.saveProducts();
    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    this.products.splice(index, 1);
    this.saveProducts();
  }
}

// Uso del ProductManager
const productManager = new ProductManager('products.json');

console.log(productManager.getProducts()); // []

const newProduct = productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});
console.log(productManager.getProducts()); 

// Intentar agregar el mismo producto debería arrojar un error
try {
  productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  });
} catch (error) {
  console.error(error.message); 
}

// Obtener un producto por ID
try {
  const foundProduct = productManager.getProductById(1);
  console.log(foundProduct); 
} catch (error) {
  console.error(error.message);
}

// Intentar obtener un producto con un ID no existente debería arrojar un error
try {
  productManager.getProductById(999);
} catch (error) {
  console.error(error.message); 
}

// Actualizar un producto
try {
  const updatedProduct = productManager.updateProduct(1, { price: 250 });
  console.log(updatedProduct); 
} catch (error) {
  console.error(error.message);
}

// Eliminar un producto
try {
  productManager.deleteProduct(1);
  console.log(productManager.getProducts()); // []
} catch (error) {
  console.error(error.message);
}