const router = require("express").Router();
const mysql = require('../service/dbPoolService');

//select items for banner
router.get("/", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT * FROM TRANSACTION`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

module.exports = router