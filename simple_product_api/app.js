const express = require('express')
const bodyParser = require('body-parser')

const storeRouter = require('./src/routes/store')

require('./config/database')

const port = 3003

const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/stores', storeRouter)

app.listen(port, () => console.log(`O bixo ta de pé na porta ${port}`))