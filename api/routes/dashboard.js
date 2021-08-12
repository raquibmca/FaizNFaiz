const router = require("express").Router();
const { API_ROLE_ADMIN, API_ROLE_USER } = require('./../common/role');
const mysql = require('../service/dbPoolService');
const { encrypt } = require('../common/cipher');

// select items for banner
router.get("/:id", async (req, res) => {
    const connection = await mysql.connection();
    try {
        let sql = `select role, refcode from users where isactive=1 and id=${req.params.id}`;
        let response = await connection.query(sql);
        let role = response[0].role;
        if (role == API_ROLE_ADMIN) {
            const order = await connection.query(`
                        SELECT
                            os.Status,
                            ROUND(SUM(uo.BillAmount),2) AS BillAmount,
                            ROUND(SUM(uo.NetPayAmount),2) AS NetAmount,
                            ROUND(SUM(uo.DeliveryCharge),2) AS DeliveryCharge,
                            ROUND(SUM(uo.ServiceCharge),2) AS ServiceCharge,
                            ROUND(SUM(uo.RefDiscount),2) AS RefDiscount,
                            COUNT(1) AS OrderCount,
                            COUNT(RefCode) as ReferalCount,
                            uo.RefCode
                        FROM
                            userorder AS uo
                        JOIN orderstatus AS os
                        ON
                            uo.Status = os.Id
                        WHERE
                            uo.OrderDate >= DATE_ADD(
                                uo.OrderDate,
                                INTERVAL -6 YEAR_MONTH
                            )
                        GROUP BY
                            uo.status, uo.RefCode;
                    `);
            let o = order.filter(f => f.RefCode != null).map(m => m.RefCode)

            let userRes = await connection.query(
                `SELECT COUNT(1) AS RefUserCount FROM USERS WHERE RefCode in (?)`, [o]);

            const hotItem = await connection.query(`
                   SELECT
                        od.ItemId as ItemId,
                        u.Name as UserName,
                        u.Id as UserId,
                        u.ProfilePicture as ProfilePicture,
                        i.ItemName as ItemName,
                        COUNT(1) as Count,
                        SUM(od.Qty) as TotalQty,
                        ROUND(COUNT(1) * SUM(od.Qty),2) as Amount
                    FROM userorder uo JOIN orderdetail od
                    ON uo.Id = od.OrderId
                    JOIN item i ON i.Id = od.ItemId
                    JOIN users u ON u.Id = uo.UserId
                    WHERE uo.OrderDate >= DATE_ADD(uo.OrderDate, INTERVAL -6 YEAR_MONTH)
                    GROUP BY od.ItemId, uo.UserId
                    ORDER BY Amount DESC
                    LIMIT 10;
                        `);
            response = {
                order: order,
                hotItem: hotItem,
                refUserCount: userRes && userRes.length > 0 ? userRes[0].RefUserCount : 0
            }
        }

        if (role == API_ROLE_USER) {
            const order = await connection.query(`
                        SELECT
                            os.Status,
                            os.Id as StatusId,
                            ROUND(SUM(uo.NetPayAmount),2) AS NetAmount,
                            COUNT(1) AS OrderCount
                        FROM
                            userorder AS uo
                        JOIN orderstatus AS os
                        ON
                            uo.Status = os.Id
                        WHERE
                            uo.UserId = ${req.params.id} AND
                            uo.OrderDate >= DATE_ADD(
                                uo.OrderDate,
                                INTERVAL -6 YEAR_MONTH
                            )
                        GROUP BY
                            uo.status;
                    `);

            const refCount = await connection.query(`
                        SELECT
                            COUNT(uo.RefCode) AS RefCount
                        FROM
                            userorder AS uo
                        JOIN users u ON
                            u.RefCode = uo.RefCode
                        WHERE
                            u.Id = ${req.params.id} AND uo.OrderDate >= DATE_ADD(
                                uo.OrderDate,
                                INTERVAL -6 YEAR_MONTH
                            )
                    `);
            response = {
                order: order, refCount: refCount[0].RefCount
            }
        }
        res.status(200).json(encrypt(JSON.stringify(response)));
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await connection.release();
    }
});


module.exports = router;
