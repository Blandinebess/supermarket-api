import express from 'express'
import { pool } from './db/cn.js'

const app = express()
app.use(express.json())

// get = select = read the table
app.get('/customer', async (req, res) => {

    const sql = `SELECT * FROM customer`
    const result = await pool.query(sql)
    res.json(result[0])

})

// post = create = insert in the table 

app.post('/customer', async (req, res) => {

    const { name, phone, email } = req.body
    const sql = ` insert into  customer (name, phone, email) values ('${name}', '${phone}', '${email}')`
    const result = await pool.query(sql)
    res.json({ message: "User Created" })

})

// put = update  = modify

app.put('/customer/:id', async (req, res) => {

    const { id } = req.params
    const { name, phone, email } = req.body

    const sql = ` update  customer
                    set name = '${name}', 
                        phone = '${phone}',
                        email = '${email}'
                 where customer_id = ${id}`

    const result = await pool.query(sql)

    res.json({ message: "User Updated" })

})

app.delete('/customer/:id', async (req, res) => {

    const { id } = req.params
    const sql = `delete from customer where customer_id = ${id} `
    const result = await pool.query(sql)
    res.json({ message: "User Deleted" })

})

app.listen(3000)