const express = require('express');
const router = express.Router();

const connection = require('./dbConnect.js');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

router
    .get('/members',async (req,res) =>{
        const userId = req.session.userId;
        const conn = await connection;
        try{
            const [results] = await conn.query(`
                SELECT *
                FROM members
                WHERE user_id = ?`,
                [userId]
            )
        res.render('members.ejs', {members: results});
        }catch (err) {
            console.error(err);
        }            
    });
module.exports = router;