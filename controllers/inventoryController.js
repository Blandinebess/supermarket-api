import { pool } from "../db/cn.js";

export const getInventory = async(req, res)=>{

    const sql = `select * from inventory`
    const result = await pool.query(sql);
    res.json(result[0])

}

export const postInventory = async (req, res)=>{

    const {name, price, stock} = req.body;

    const sql = `insert into inventory 
                    (name, price, stock)
                values 
                ('${name}', ${price}, ${stock} )`

    const result = await pool.query(sql);

    res.json({message:"Object Created"})

}

// update (primary key as a parameter)
// and the information to update will be recevied in the body
export const putInventory = async( req, res)=>{

    const {id} = req.params
    const {name, stock, price} = req.body

    const sql = `update inventory
                    set name = '${name}',
                        stock = ${stock},
                        price = ${price}
                where product_id = ${id}`
    
    const result = await pool.query(sql)

    res.json({message: "Object Updated"})

}

// delete (id or primary of the element as a parameter)

export const deleteInventory = async(req, res)=>{

    const {id} = req.params

    const sql = `delete from inventory 
                    where product_id = ${id}`

    const result = pool.query(sql)

    res.json({message: "Object deleted"})

}