const router = require("express").Router();
const bcrypt = require("bcrypt");

const mysql = require('../service/dbPoolService');

//select order by date range
router.get("/orderstatus", async (req, res) => {
    const connection = await mysql.connection();
    try {
        const sql = `SELECT Id, Status FROM OrderStatus Where Id IN (4,5,6,21)`;
        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//select order for user
router.post("/getorder/", async (req, res) => {
    const connection = await mysql.connection();
    try {
        let subquery = req.body.uid !== undefined ? ` AND uo.UserId = ${req.body.uid}` : '';
        subquery += req.body.status !== undefined ? ` AND uo.Status = ${req.body.status}` : '';
        const sql =
            `SELECT
                        uo.OrderNo,
                        uo.OrderDate,
                        u.Name,
                        os.Status,
                        uo.NetPayAmount,
                        COUNT(od.ItemId) AS ItemCount,
                        SUM(od.Qty) AS TotalQty
                    FROM
                        userorder uo
                    JOIN orderstatus os ON
                        uo.Status = os.Id
                    JOIN users u ON
                        uo.UserId = u.Id
                    JOIN orderdetail od ON
                        od.OrderId = uo.id
                    WHERE
                        uo.OrderDate >=
                        DATE_ADD(uo.OrderDate, INTERVAL -6 YEAR_MONTH) 
                        ${subquery}
                    GROUP BY
                            od.OrderId
                    ORDER BY uo.OrderDate DESC, u.Name`;

        const response = await connection.query(sql);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

//insert 
router.post("/", async (req, res) => {
    const connection = await mysql.connection();
    let orderNo;
    await generateUniqueNumber().then(v => orderNo = v);
    try {
        req.body.order.orderdate = mysql.escape(new Date());
        await connection.query("START TRANSACTION");
        let sql = `INSERT INTO USERORDER (
                        UserId,
                        OrderDate,
                        OrderNo,
                        RefCode,
                        RefDiscount,
                        PaymentMode,
                        AddressId,
                        DeliveryCharge,
                        ServiceCharge,
                        GSTCharge,
                        Status,
                        BillAmount,
                        NetPayAmount
                    ) VALUES (
                        ${req.body.userid},
                        ${req.body.order.orderdate},
                        '${orderNo}',
                        ${req.body.order.refcode === null ? `null` : `'${req.body.order.refcode}'`},
                        ${req.body.order.refdiscount},
                        ${req.body.order.paymentmode},
                        ${req.body.order.addressid},
                        ${req.body.order.deliverycharge},
                        ${req.body.order.servicecharge},
                        ${req.body.order.gstcharge},
                        ${req.body.order.status},
                        ${req.body.order.billamount},
                        ${req.body.order.netpayamount}
                        );`;
        let response = await connection.query(sql);

        var od = req.body.detail.map(o => (
            {
                id: o.id,
                rate: o.rate,
                qty: parseInt(o.qty)
            })).map(d => Object.values(d));
        od.map(od => od.unshift(response.insertId));

        sql = `INSERT INTO ORDERDETAIL (
                        OrderId,
                        ItemId,
                        Price,
                        Qty
                    ) VALUES ?`
        await connection.query(sql, [od]);

        sql = `INSERT INTO ORDERSTATUSHISTORY (
                        OrderId,
                        Status,
                        CreatedBy
                    ) VALUES (
                        ${response.insertId},
                        ${req.body.order.status},
                        ${req.body.userid}
                        );`
        await connection.query(sql);

        if (req.body.orderchargejson) {
            sql = `INSERT INTO ORDERCHARGES (
                            OrderId,
                            Rule,
                            Data
                        ) VALUES (
                            ${response.insertId},
                            '${req.body.orderchargejson.rule}',
                            '${req.body.orderchargejson.data}'
                            );`
            await connection.query(sql, od);
        }

        await connection.query("COMMIT");
        res.status(200).json({ ordno: orderNo, orderid: response.insertId, order: req.body });
    } catch (err) {
        console.log(err)
        await connection.query("ROLLBACK");
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});

const generateUniqueNumber = async () => {
    //var chksum = d.getFullYear() + d.getMonth() + d.getDay() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();
    const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(salt, salt);
    var index = Math.floor(Math.random() * (10 /*max*/ - 0 /*min*/ + 1));
    var refcode = salt.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, index).toUpperCase().substr(0, 28);
    let sum = 0
    for (i = 0; i < refcode.length; i += 2) {
        sum += (refcode.charCodeAt(i) * refcode.charCodeAt(i + 1)) //+ chksum;
    }
    //sum *= Math.floor((index + 1) * Math.sqrt(sum));
    var value = refcode.replace(/[0-9]/g).substr(index, 3).toUpperCase() + sum.toString().padStart(7, "0");
    return new Promise(resolve => resolve(value));
}

module.exports = router;
