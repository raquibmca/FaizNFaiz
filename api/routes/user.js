const router = require("express").Router();
const bcrypt = require("bcrypt");
const mysql = require('../service/dbPoolService');
var multer = require('multer');
const path = require('path');
//var upload = multer({ dest: 'public/images/person' })

//select 
router.get("/getAll", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT id, lpad(substring(Username,7,4),10,'X') as username, 
                            name, profilepicture, isactive, isrefactive, isblocked, 
                            refcode, gender, email,dob, createdate as joindate, lastlogin 
                            FROM USERS where IsDeleted = 0 AND Role > 1`;
        const response = await connection.query(sql)
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

router.get("/isavailable/:username", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT 1 FROM USERS WHERE USERNAME='${req.params.username}'`;
        const response = await connection.query(sql)
        res.status(200).json(response.length > 0);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

// //select
router.get("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT * FROM USERS WHERE Id = ${req.params.id}`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//update records
router.put("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `UPDATE USERS SET 
                        Name     = '${req.body.name}',
                        Gender   = '${req.body.gender}',
                        Dob      = '${req.body.dateofbirth}',
                        Email    = ${req.body.email === null ? `null` : `'${req.body.email}'`},
                        HintId   = ${req.body.questionhint},
                        HintText = '${req.body.userhint}'
                    WHERE ID = ${req.params.id};`;
        const response = await connection.query(sql)
        res.status(200).json(req.body);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//change password
router.put("/changepassword/:id", async (req, res) => {
    let result = { hasError: false, errorMessage: null, data: null };
    const connection = await mysql.connection();
    try {
        let sql = `SELECT Password FROM USERS WHERE Id='${req.params.id}';`;
        let response = await connection.query(sql);
        if (response.length === 0) {
            result.hasError = true;
            result.errorMessage = "User doesn't exist.";
        }
        else {
            let isValid = await bcrypt.compare(req.body.password, response[0].Password);
            if (!isValid) {
                result.hasError = true;
                result.errorMessage = "Incorrect password.";
            }

            if (isValid) {
                isValid = req.body.password !== req.body.newpassword;
                if (!isValid) {
                    result.hasError = true;
                    result.errorMessage = "Old and new password should be different.";
                }
            }

            if (isValid) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.newpassword, salt);
                sql = `UPDATE USERS SET Password = '${hashedPassword}' WHERE ID =  '${req.params.id}';`;
                connection.query(sql, (err, result) => {
                    if (err) {
                        throw err;
                    } else {
                        response = result;
                    }
                })
            }
        }
        result.data = response?.data;
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send(err.message)
    } finally {
        await connection.release();
    }
});

//toggle active 
router.put("/toggleactive/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `UPDATE USERS SET IsActive = NOT IsActive WHERE ID =  '${req.params.id}';`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//block user
router.put("/block/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql1 = `UPDATE USERS SET 
                            IsBlocked = ${req.body.blocked} ,
                            IsActive = ${req.body.active} ,
                            IsRefActive = ${req.body.refactive}
                        WHERE ID =${req.params.id};`;
        const sql2 = `INSERT INTO UserAccountActions(UserId, Type, Remarks, CreatedBy) VALUES(
                ${req.params.id},
                 'FLAG-UPDATED',
                '${req.body.remarks}',
                ${req.body.userId}
                );`;
        await connection.query("START TRANSACTION");
        await connection.query(sql1);
        await connection.query(sql2);
        await connection.query("COMMIT");
        res.status(200).json({ result: "success" });
    } catch (err) {
        await connection.query("ROLLBACK");
        console.log(err)
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//undo delete
router.put("/undodelete/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `UPDATE USERS SET IsDeleted = 0 WHERE ID =  '${req.params.id}';`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

router.get("/verifyRefcode/:id/:refCode", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT Id, RefCode, IsRefActive FROM USERS WHERE 
                (
                    (ID = ${req.params.id} AND RefCode = '${req.params.refCode.trim()}') OR 
                    RefCode = '${req.params.refCode.trim()}'
                ) AND IsRefActive = 1;`;
        const response = await connection.query(sql);
        let error = { hasError: false, errorMessage: null };
        if (response.length > 0) {
            error = {
                hasError: response[0].Id == req.params.id,
                errorMessage: response[0].Id == req.params.id ? 'You cannot use your own referal code.' : null
            }
        } else {

            error = { hasError: true, errorMessage: 'Invalid referal code.' }
        }
        res.status(200).json(error);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

router.put("/updateprofile/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `UPDATE USERS SET 
                        ProfilePicture = ${req.body.filename === null ? `null` : `'${req.body.filename}'`}
                    WHERE ID = '${req.params.id}';`;
        const response = await connection.query(sql);
        res.status(200).json(response);
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
        const sql = `UPDATE USERS SET IsDeleted = 1 WHERE ID =  '${req.params.id}';`;
        const response = await connection.query(sql)
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/person/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload only png and jpg image.'))
        }
        cb(undefined, true)
    }
});

router.post("/upload/:id", upload.single('images'), (req, res) => {
    res.send(req.file)
}, (error, req, res, next) => {
    console.log(error)
    res.status(400).send({ hasError: true, errorMessage: error.message })
});

//user activities
router.get("/activity/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT
                        uac.type,
                        uac.remarks,
                        uac.createdat,
                        u.name
                    FROM
                        useraccountactions uac
                    JOIN users u ON
                        uac.CreatedBy = u.id
                    WHERE
                        uac.UserId = ${req.params.id}
                        ORDER BY
                            uac.createdat
                        DESC`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

module.exports = router;
