const express = require('express');
const router = express.Router();

const connection = require('./dbConnect.js');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

router
    .get('/personal/:id',async (req,res) =>{
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [member] = await conn.query(`
                SELECT *
                FROM members
                WHERE id = ?
                AND user_id = ?`,
                [req.params.id, userId],
            );

            const [addResults] = await conn.query(`
                SELECT SUM(price) AS sum
                FROM spendings
                JOIN members
                ON spendings.name = members.name
                WHERE members.id = ?
                AND payment='-'
                AND members.user_id = ?
                AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')`,
                [req.params.id,userId],
            );

            const [addSpendings] = await conn.query(`
                SELECT *
                FROM spendings
                JOIN members
                ON spendings.name = members.name
                WHERE members.id = ?
                AND payment='-'
                AND members.user_id = ?
                AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')
                ORDER BY date DESC, spendings.id DESC`,
                [req.params.id,userId],
            );

            const [subResults] = await conn.query(`
                SELECT SUM(price) AS sum
                FROM spendings
                JOIN members
                ON spendings.name = members.name
                WHERE members.id = ?
                AND payment='○'
                AND members.user_id = ?
                AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')`,
                [req.params.id,userId],
            );

            const [subSpendings] = await conn.query(`
                SELECT *
                FROM spendings
                JOIN members
                ON spendings.name = members.name
                WHERE members.id = ?
                AND payment='○'
                AND members.user_id = ?
                AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')
                ORDER BY date DESC, spendings.id DESC`,
                [req.params.id,userId],
            );
            res.render('personal.ejs',{member, add: addResults[0].sum, addSpendings, sub: subResults[0].sum, subSpendings});
        }catch (err) {
            console.error(err);
        }
    })

    .get('/lm-personal/:id',async (req,res) =>{
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [member] = await conn.query(`
                SELECT *
                FROM members
                WHERE id = ?
                AND user_id = ?`,
                [req.params.id,userId],
            );

            const [addResults] = await conn.query(`
                SELECT SUM(price) AS sum
                FROM spendings
                JOIN members
                ON spendings.name = members.name
                WHERE members.id = ?
                AND payment='-'
                AND members.user_id = ?
                AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')`,
                [req.params.id,userId],
            );

            const [addSpendings] = await conn.query(`
                SELECT *
                FROM spendings
                JOIN members
                ON spendings.name = members.name
                WHERE members.id = ?
                AND payment='-'
                AND members.user_id = ?
                AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')
                ORDER BY date DESC, spendings.id DESC`,
                [req.params.id,userId],
            );

            const [subResults] = await conn.query(`
                SELECT SUM(price) AS sum
                FROM spendings
                JOIN members
                ON spendings.name = members.name
                WHERE members.id = ?
                AND payment='○'
                AND members.user_id = ?
                AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')`,
                [req.params.id,userId],
            );

            const [subSpendings] = await conn.query(`
                SELECT *
                FROM spendings
                JOIN members
                ON spendings.name = members.name
                WHERE members.id = ?
                AND payment='○'
                AND members.user_id = ?
                AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')
                ORDER BY date DESC, spendings.id DESC`,
                [req.params.id,userId],
            );
            res.render('lm-personal.ejs',{member, add: addResults[0].sum, addSpendings, sub: subResults[0].sum, subSpendings});
        }catch (err) {
            console.error(err);
        }
    });
module.exports = router;