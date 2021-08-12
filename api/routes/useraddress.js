const router = require("express").Router();
const mysql = require('../service/dbPoolService');

//select
router.get("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT Id,address1,address2,street,district,state,post,zip,landmark,isactive
                FROM ADDRESS WHERE UserId=${req.params.id} ORDER BY IsActive DESC;`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

router.get("/byid/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT Id,address1,address2,street,district,state,post,zip,landmark,isactive
                FROM ADDRESS WHERE UserId=${req.params.id} ORDER BY IsActive DESC;`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

router.get("/activeaddress/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT Id,address1,address2,street,district,state,post,zip,landmark,isactive FROM ADDRESS WHERE UserId=${req.params.id} AND IsActive = 1;`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//insert
router.post("/:id", async (req, res) => {
    req.body.address1 = req.body.address1 === undefined ? null : req.body.address1;
    const connection = await mysql.connection();
    try {
        const sql = `INSERT INTO ADDRESS (Userid,Address1,Address2,Street,District,State,Post,Zip,Landmark) VALUES 
        ( 
            ${req.params.id},
            '${req.body.address1}',
            ${req.body.address2 === null ? `null` : `'${req.body.address2}'`},
            '${req.body.street}',
            '${req.body.district}',
            '${req.body.state}',
            '${req.body.post}',
            '${req.body.zip}',
            ${req.body.landmark === null ? `null` : `'${req.body.landmark}'`}
        );`;
        const response = await connection.query(sql);
        req.body.Id = response.insertId
        req.body.IsActive = 0;
        res.status(200).json(req.body);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//update
router.put("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `UPDATE ADDRESS SET 
                            Address1 ='${req.body.address1}',
                            Address2= ${req.body.address2 === null ? `null` : `'${req.body.address2}'`},
                            Street='${req.body.street}',
                            District ='${req.body.district}',
                            State ='${req.body.state}',
                            Post ='${req.body.post}',
                            Zip ='${req.body.zip}',
                            Landmark =${req.body.landmark === null ? `null` : `'${req.body.landmark}'`}
                        WHERE Id =${req.params.id};`;
        await connection.query(sql);
        res.status(200).json(req.body);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//update active
router.put("/setactive/:id", async (req, res) => {
    const connection = await mysql.connection({ multipleStatements: true });
    try {
        let sql = `UPDATE ADDRESS SET IsActive = 0 WHERE UserId = ${req.body.userid};`;
        await connection.query(sql);
        sql = `UPDATE ADDRESS SET IsActive = 1 WHERE Id = ${req.params.id};`;
        await connection.query(sql);
        res.status(200).json(req.body);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});


//delete 
router.delete("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `DELETE FROM ADDRESS WHERE Id ='${req.params.id}';`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

module.exports = router;
