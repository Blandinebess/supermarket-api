import express from 'express'
import { customer } from './routes/routeCustomer.js'
import { inventory } from './routes/routeInventory.js'
const app = express()
app.use(express.json())
app.use(customer)
app.use(inventory)

app.listen(3000)