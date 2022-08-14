const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
}, { _id: true })

const storeSchema = mongoose.Schema({
    name: { type: String, required: true },
    CNPJ: { type: Number, required: true },
    products: { type: [productSchema], default: [] }
})

module.exports = mongoose.model('Store', storeSchema, 'stores')