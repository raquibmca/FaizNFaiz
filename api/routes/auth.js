//const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mysql = require('../service/dbPoolService');

//LOGIN
router.post("/login", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT Id,Name,Username,Role,Password,Profilepicture,Lastlogin
                        FROM USERS WHERE username='${req.body.username}';`;
        const response = await connection.query(sql);

        if (response.length === 0)
            return res.status(404).json({ hasError: true, errorMessage: "User doesn't exist." });

        if (response.length > 0 && response[0].IsActive === 1)
            return res.status(404).json({ hasError: true, errorMessage: "This account is not active." });

        const validPassword = await bcrypt.compare(req.body.password, response[0].Password)
        if (!validPassword)
            return res.status(400).json({ hasError: true, errorMessage: "Username or password invalid." });

        await connection.query(`UPDATE USERS SET LastLogin=now() WHERE username='${req.body.username}';`);
        const token = await jwt.sign({
            id: response[0].Id,
            name: response[0].Name,
            username: response[0].Username,
            role: response[0].Role,
            lastLogin: response[0].Lastlogin,
            profilePicture: response[0].Profilepicture,
        }, process.env.TOKEN_SECERET_KEY);

        res.status(200).send({ hasError: false, token: token });
        // res.header('x-auth-token', `Bearer ${token}`).status(200).send('Ok');
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

// router.post("/register", async (req, res) => {
//     const connection = await mysql.connection();
//     try {
//         //generate new password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);
//         var index = Math.floor(Math.random() * (10 /*max*/ - 0 /*min*/ + 1));
//         var refcode = salt.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').toUpperCase().substr(index, 8);
//         const sql = `INSERT INTO USERS (NAME,USERNAME,ROLE,PASSWORD,Refcode,IsActive) VALUES
//                         (   
//                             '${req.body.name}', 
//                             '${req.body.username}', 
//                             '${req.body.role}', 
//                             '${hashedPassword}', 
//                             '${refcode}',
//                              ${req.body.isActive}
//                         );`;
//         const response = await connection.query(sql);
//         res.status(200).json(response);
//     } catch (err) {
//         res.status(500).json(err)
//     } finally {
//         await connection.release();
//     }
// });


module.exports = router;