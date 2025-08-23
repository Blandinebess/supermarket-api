import { pool } from "../db/cn.js";

export const getCustomer = async (req, res) => {

    const sql = `SELECT * FROM customer`
    const result = await pool.query(sql)
    res.json(result[0])

}

export const postCustomer = async (req, res) => {

    const { name, phone, email } = req.body
    const sql = ` insert into  customer (name, phone, email) values ('${name}', '${phone}', '${email}')`
    const result = await pool.query(sql)
    res.json({ message: "User Created" })

}

export const putCustomer =  async (req, res) => {

    const { id } = req.params
    const { name, phone, email } = req.body

    const sql = ` update  customer
                    set name = '${name}', 
                        phone = '${phone}',
                        email = '${email}'
                 where customer_id = ${id}`

    const result = await pool.query(sql)

    res.json({ message: "User Updated" })

}

export const deleteCustomer = async (req, res) => {

    const { id } = req.params
    const sql = `delete from customer where customer_id = ${id} `
    const result = await pool.query(sql)
    res.json({ message: "User Deleted" })

}