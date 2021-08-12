const router = require("express").Router();
const mysql = require('../service/dbPoolService');

//----------------------------C A T E G O R Y  S E C T I O N -----------------------------------//

//get category
router.get("/", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT id,name,code FROM ITEMCATEGORY WHERE ID > 1;`;
        const itemcategoryResult = await connection.query(sql);
        res.status(200).json(itemcategoryResult);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

router.get("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT id,name,code FROM ITEMCATEGORY WHERE id=${req.params.id}`;
        const itemcategoryResult = await connection.query(sql);
        res.status(200).json(itemcategoryResult);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

router.post("/", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `INSERT INTO ITEMCATEGORY (
                            code,
                            name
                            ) VALUES ?`
        const response = await connection.query(sql, [req.body.data]);
        res.status(200).json(response);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

router.delete("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `DELETE FROM ITEMCATEGORY WHERE ID=${req.params.id};`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

router.put("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        if (req.params.id == 1) throw Error('No such recod exist.')
        const sql = `UPDATE ITEMCATEGORY SET 
                        code='${req.body.code}',
                        name='${req.body.name}' 
                    WHERE ID=${req.params.id};`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

module.exports = router;