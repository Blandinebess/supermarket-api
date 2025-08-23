import express from 'express'
export const customer = express.Router()
import { getCustomer , 
        postCustomer, 
        putCustomer,
        deleteCustomer
    } from '../controllers/customerController.js' 

customer.get('/customer', getCustomer)
customer.post('/customer', postCustomer)
customer.put('/customer/:id', putCustomer)
customer.delete('/customer/:id', deleteCustomer)