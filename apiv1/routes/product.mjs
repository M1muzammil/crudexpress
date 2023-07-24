
import express from 'express';
import { nanoid } from 'nanoid'
let router = express.Router()

// not recommended at all - server should be stateless
let products = [
   
]

// product    /api/v1/product
router.post('/product', (req, res, next) => {

    if (
        !req.body.product
        || !req.body.price
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            product: "abc product product",
            price: "some product price"
        } `);
        return;
    }

    products.push({
        id: nanoid(),
        product: req.body.product,
        price: req.body.price,
    })

    res.send('product created');
})

// GET  ALL   productS   /api/v1/products/
router.get('/product/:productId', (req, res, next) => {
    console.log('this is signup!', new Date());

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === Number(req.params.productId)) {
            res.send(products[i]);
            return;
        }
    }
    res.send('product not found with id ' + req.params.productId);
})

//GET  ONE   product   /api/v1/product/:productId
router.get('/products', (req, res, next) => {
    res.send(products);
})

// DELETE  /api/v1/product/:productId
router.delete('/product/:productId', (req, res, next) => {
    console.log('this is signup!', new Date());

    const productId = req.params.productId;

    // Find the product index in the products array
    const productIndex = products.findIndex(product => product.id === productId);

    // If the product with the given ID exists, remove it
    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        res.send('product deleted');
    } else {
        res.status(404).send('product not found');
    }
});

// EDIT product

// PUT /api/v1/product/:productId
router.put('/product/:productId', (req, res, next) => {
  
    const productId = req.params.productId;
  
    // Find the product index in the products array
    const productIndex = products.findIndex(product => product.id === productId);
  
    // If the product with the given ID exists, update it
    if (productIndex !== -1) {
      // Check if both product and price are provided in the request body
      if (!req.body.product || !req.body.price) {
        res.status(403).send('product and price are required for updating a product');
        return;
      }
  
      // Update the product with the new data
      products[productIndex].product = req.body.product;
      products[productIndex].price = req.body.price;
  
      res.send('product updated');
    } else {
      res.status(404).send('product not found');
    }
  });
  

export default router