const router = require("express").Router();
const mysql = require('../service/dbPoolService');

// select items for banner
router.get("/", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT id,name,code,itempic FROM ITEMS WHERE IsActive = 1`;

        const itemResuslt = await connection.query(sql);
        res.status(200).json(itemResuslt);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});


router.get("/byid/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT id,name,code,itempic FROM ITEMS WHERE IsActive = 1 AND I.id = ${req.params.id}`;
        const itemResuslt = await connection.query(sql);
        res.status(200).json(itemResuslt);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

// //select by category
// router.get("/bycatid/:cid", async (req, res) => {
//     const connection = await mysql.connection();
//     try {
//         const sql = `SELECT I.id, I.itemcode, I.itemname, I.rate, I.category, IC.NAME AS categoryname FROM ITEM I
//                     LEFT JOIN ITEMCATEGORY IC ON I.category = IC.ID
//                     WHERE I.IsActive = 1 AND IC.ID = ${req.params.cid}`;
//         const response = await connection.query(sql);
//         res.status(200).json(response);
//     } catch (err) {
//         res.status(500).json(err)
//     } finally {
//         await connection.release();
//     }
// });

//insert 
router.post("/", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `INSERT INTO ITEMS (
                            name,
                            code,
                            itempic
                            ) VALUES (
                                '${req.body.name}',
                                '${req.body.code}',
                                '${req.body.itempic}',
                            )`
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//update
router.put("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `UPDATE ITEMS SET 
                        code = '${req.body.itemcode}',
                        name = '${req.body.itemname}',
                    WHERE ID =  '${req.params.id}';`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//delete 
router.delete("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `UPDATE ITEMS SET IsActive = 0 WHERE Id ='${req.params.id}';`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

// router.post("/search", async (req, res) => {
//     const connection = await mysql.connection();
//     try {
//         let inner_query = req.body.itemcode !== '' ? ` AND code Like '%${req.body.itemcode}%'` : '';
//         inner_query += req.body.itemname !== '' ? ` AND name Like '%${req.body.itemname}%'` : '';

//         const sql = `SELECT I.id, I.code, I.name, I.rate, I.category, IC.NAME AS categoryname FROM ITEM I
//                     LEFT JOIN ITEMCATEGORY IC ON I.category = IC.ID WHERE I.IsActive = 1 ${inner_query}`;
//         const response = await connection.query(sql);
//         res.status(200).json(response);
//     } catch (err) {
//         res.status(500).json(err)
//     } finally {
//         await connection.release();
//     }
// });

module.exports = router;
