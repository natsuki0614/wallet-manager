const express = require('express');
const router = express.Router();

const connection = require('./dbConnect.js');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

router
.get('/member-new', (req, res) => {
    res.render('member-new.ejs');
})

.post('/member-create',async (req, res) => {
    const userId = req.session.userId;
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `INSERT INTO members(name,monthly,user_id) 
             VALUES(?,?,?)`,
            [req.body.memberName,req.body.memberMonthly,userId]
        );
        res.redirect('/members');
    }catch (err) {
        console.error(err);
    }            
})

.post('/member-delete/:id',async (req,res) => {
    const userId = req.session.userId;
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `DELETE FROM members 
             WHERE id = ?
             AND user_id = ?`,
            [req.params.id,userId],
        );
        res.redirect('/members');
    }catch (err) {
        console.error(err);
    }
})

.get('/member-edit/:id',async (req, res) => {
    const userId = req.session.userId;
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `SELECT * FROM members
             WHERE id = ?
             AND user_id = ?`,
            [req.params.id,userId],
        );
        res.render('member-edit.ejs',{member: results[0]});
    }catch (err) {
        console.error(err);
    }
})

.post('/member-update/:id',async (req, res) => {
    const userId = req.session.userId;
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `UPDATE members 
             SET name = ?, monthly = ? 
             WHERE id = ?
             AND user_id = ?`,
            [req.body.memberName,req.body.memberMonthly,req.params.id,userId],
        );
        res.redirect('/members');
    }catch (err) {
        console.error(err);
    }
})
module.exports = router;
