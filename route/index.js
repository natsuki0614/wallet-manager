const express = require('express');
const router = express.Router();

const connection = require('./dbConnect.js');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

router
    .get('/index', async(req, res) => {
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [spendings] = await conn.query(`
                SELECT *
                FROM spendings
                WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')
                AND user_id = ?
                ORDER BY date DESC, id DESC`,
                [userId]
            );
    
            const [results] = await conn.query(`
                SELECT SUM(price) as sum
                FROM spendings
                WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')
                AND user_id = ?`,
                [userId]
            );
    
            res.render('index.ejs', {spendings, sum: results[0].sum});
        }catch (err) {
            console.error(err);
        }
    })

    .get('/last-month', async(req,res) => {
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [spendings] = await conn.query(`
                SELECT *
                FROM spendings
                WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')
                AND user_id = ?
                ORDER BY date DESC, id DESC`,
                [userId]
            );
            
    
            const [results] = await conn.query(`
                SELECT SUM(price) as sum
                FROM spendings
                WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')
                AND user_id = ?`,
                [userId]
            );
            
            res.render('index.ejs', {spendings, sum: results[0].sum});
        }catch (err) {
            console.error(err);
        }            
    });

module.exports = router;