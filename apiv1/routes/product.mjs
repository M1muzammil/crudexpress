
import express from 'express';
import { nanoid } from 'nanoid'
import {client } from '../../mongodb.mjs'
const db = client.db("mongocrud")
const col = db.collection("products")
let router = express.Router()

// not recommended at all - server should be stateless


// product    /api/v1/product
router.post('/product',async (req, res, next) => {

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

    const insertResponse = await col.insertOne({
        id: nanoid(),
        product: req.body.product,
        price: req.body.price,
    })
    console.log(insertResponse)

    res.send('product created');
})
router.get('/products', async(req, res, next) => {
    try {
        const cursor = col.find({}).sort({ timestamp: -1 });
        let results = (await cursor.toArray()).reverse();

        console.log(results);
        res.send(results);
    } catch (error) {
        console.error(error);
    }
});

// GET  ALL   productS   /api/v1/products/
router.get('/product/:productId',async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await col.findOne({ id: productId });

        if (product) {
            res.send(product);
        } else {
            res.status(404).send('Post not found with id ' + postId);
        }
    } catch (error) {
        console.error(error);
    }
});

// DELETE  /api/v1/product/:productId
router.delete('/product/:productId', async(req, res, next) => {
    const productId = req.params.productId;

    try {
        const deleteResponse = await col.deleteOne({ id: productId });
        if (deleteResponse.deletedCount === 1) {
            res.send(`Product with id ${productId} deleted successfully.`);
        } else {
            res.send('Post not found with the given id.');
        }
    } catch (error) {
        console.error(error);
    }
});


// EDIT product

// PUT /api/v1/product/:productId
router.put('/product/:productId', async(req, res, next) => {
  
    const productId = req.params.productId;
    const { product, price } = req.body;

    if (!product || !price) {
        res.status(403).send('Required parameters missing. Please provide both "product" and "price".');
        return;
    }

    try {
        const updateResponse = await col.updateOne({ id: productId }, { $set: { product, price } });

        if (updateResponse.matchedCount === 1) {
            res.send(`product with id ${productId} updated successfully.`);
        } else {
            res.send('product not found with the given id.');
        }
    } catch (error) {
        console.error(error);
    }
});
  

export default router