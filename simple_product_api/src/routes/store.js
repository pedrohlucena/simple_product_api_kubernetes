const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const Store = require('../models/store')

router.get('/', async (req, res) => {
    try {
        const stores = await Store.find()
        res.send(stores)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao buscar pelas lojas' })
    }
})

router.get('/:id/sumPrices', async (req, res) => {
    try {
        let sumPrices = await Store.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
            { $project: { _id: 0, name: 1, products: 1 } },
            { $unwind: "$products" },
            { $group: { _id: null, sumPrices: { $sum: "$products.price" } } },
            { $project: { _id: 0, sumPrices: 1 } },
        ])
        sumPrices = sumPrices[0]
        res.send(sumPrices)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao somar os preços dos produtos da loja' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const store = await Store.findById(req.params.id)
        res.send(store)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao somar buscar pela loja' })
    }
})

router.post('/', async (req, res) => {
    const { name, CNPJ, products } = req.body
    try {
        let store
        if (products) store = await Store.create({ name, CNPJ, products })
        else store = await Store.create({ name, CNPJ })
        res.send(store)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao cadastrar loja' })
    }
})

router.post('/:id', async (req, res) => {
    const store = await Store.findById(req.params.id)
    const products = req.body.products

    try {
        products.forEach(product => {
            store.products.push(product)
        });
        await store.save()
        res.send(store)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao cadastrar o produto para a loja' })
    }
})

router.put('/:id', async (req, res) => {
    const store = await Store.findById(req.params.id)
    try {
        store.set(req.body)
        await store.save()
        res.send(store)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao atualizar loja' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const store = await Store.findByIdAndDelete(req.params.id)
        res.send(store)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao deletar loja' })
    }
})

router.delete('/:id/deleteProducts', async (req, res) => {
    try {
        const store = await Store.findById(req.params.id)
        store.products = []
        store.save()
        res.send(store)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao deletar os produtos loja' })
    }
})

router.delete('/:storeId/:productId', async (req, res) => {
    try {
        const store = await Store.findById(req.params.storeId)
        const product = store.products.find(product => product._id == req.params.productId)
        const indexOfProduct = store.products.indexOf(product);
        if (indexOfProduct > -1) store.products.splice(indexOfProduct, 1);
        else throw new Error('Erro ao deletar o produto loja')
        store.save()
        res.send(product)
    } catch (error) {
        console.log(error)
        res.send({ error: 'Erro ao deletar o produto loja' })
    }
})

module.exports = router