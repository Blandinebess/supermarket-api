import express from 'express'
export const inventory = express.Router()
import { postInventory ,
        getInventory,
        putInventory,
        deleteInventory
} from '../controllers/inventoryController.js'

inventory.get('/inventory',getInventory )
inventory.post('/inventory',postInventory )
inventory.put('/inventory/:id',putInventory )
inventory.delete('/inventory/:id', deleteInventory)