const express = require('express');
const router = express.Router();

const connection = require('./dbConnect.js');
const m = require('./today.js'); 

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

router
    .get('/new', async(req, res) => {
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [members] = await conn.query(
                `SELECT *
                FROM members
                WHERE user_id = ?`,
                [userId]
            );
            res.render('new.ejs', {members});
        }catch (err) {
            console.error(err);
        }
        
    })

    .post('/create',async (req, res) => {
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [results] = await conn.query(
                `INSERT INTO spendings(date,category,detail,price,name,payment,user_id) 
                VALUES(?,?,?,?,?,?,?)`,
                [
                    req.body.spendingDate,
                    req.body.spendingCategory,
                    req.body.spendingDetail,
                    req.body.spendingPrice,
                    req.body.spendingName,
                    req.body.spendingPayment,
                    userId
                ]
            );
            
            let createDate = new Date(req.body.spendingDate);
            let createMonth = createDate.getMonth() + 1;

            if(m == createMonth){
                res.redirect('/index');
            }else{
                res.redirect('/last-month');
            }
        }catch (err) {
            console.error(err);
        }            
    })

    .post('/delete/:id',async (req,res) => {
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [results] = await conn.query(
                `DELETE FROM spendings 
                WHERE id = ?
                AND user_id = ?`,
                [req.params.id,userId],
            );
            res.redirect('/index');
        }catch (err) {
            console.error(err);
        }
    })

    .post('/lm-delete/:id',async (req,res) => {
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [results] = await conn.query(
                `DELETE FROM spendings 
                WHERE id = ?
                AND user_id = ?`,
                [req.params.id,userId],
            );
            res.redirect('/last-month');
        }catch (err) {
            console.error(err);
        }
    })

    .get('/edit/:id',async (req, res) => {
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [results] = await conn.query(
                `SELECT * FROM spendings
                WHERE id = ?
                AND user_id = ?`,
                [req.params.id,userId],
            );
            const [members] = await conn.query(
                `SELECT *
                FROM members
                WHERE user_id = ?`,
                [userId]
            ); 
            res.render('edit.ejs',{spending: results[0],members});
        }catch (err) {
            console.error(err);
        }
    })

    .post('/update/:id',async (req, res) => {
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [results] = await conn.query(
                `UPDATE spendings 
                SET date = ?, category = ?, detail = ?, price = ?, name = ?, payment = ? 
                WHERE id = ?
                AND user_id = ?`,
                [
                    req.body.spendingDate,
                    req.body.spendingCategory,
                    req.body.spendingDetail,
                    req.body.spendingPrice,
                    req.body.spendingName,
                    req.body.spendingPayment,
                    req.params.id,
                    userId
                ],
            );
            let updateDate = new Date(req.body.spendingDate);
            let updateMonth = updateDate.getMonth() + 1;

            if(m == updateMonth){
                res.redirect('/index');
            }else{
                res.redirect('/last-month');
            }
        }catch (err) {
            console.error(err);
        }
    })

module.exports = router;