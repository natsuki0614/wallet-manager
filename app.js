const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'bsax0203',
  database: 'wallet_manager',
});

let today = new Date()
let m = today.getMonth() + 1;

app.get('/', (req, res) => {
    res.render('top.ejs');
});

app.get('/index', async(req, res) => {
    const conn = await connection;
    try{
        const [spendings] = await conn.query(`
            SELECT *
            FROM spendings
            WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')
            ORDER BY date DESC, id DESC
        `);

        const [members] = await conn.query(
            `SELECT *FROM members`);

        const [results] = await conn.query(`
            SELECT SUM(price) as sum
            FROM spendings
            WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')
        `);
        res.render('index.ejs', {spendings, members, sum: results[0].sum});
    }catch (err) {
        console.error(err);
    }
});

app.get('/last-month', async(req,res) => {
    const conn = await connection;
    try{
        const [spendings] = await conn.query(`
            SELECT *
            FROM spendings
            WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')
            ORDER BY date DESC, id DESC
        `);
        

        const [results] = await conn.query(`
            SELECT SUM(price) as sum
            FROM spendings
            WHERE DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')
        `);
        
        res.render('index.ejs', {spendings, sum: results[0].sum});
    }catch (err) {
        console.error(err);
    }            
});

app.get('/new', async(req, res) => {
    const conn = await connection;
    try{
        const [members] = await conn.query(
            `SELECT *
             FROM members`
        );
        res.render('new.ejs', {members});
    }catch (err) {
        console.error(err);
    }
    
});

app.post('/create',async (req, res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `INSERT INTO spendings(date,category,detail,price,name,payment) 
             VALUES(?,?,?,?,?,?)`,
            [
                req.body.spendingDate,
                req.body.spendingCategory,
                req.body.spendingDetail,
                req.body.spendingPrice,
                req.body.spendingName,
                req.body.spendingPayment
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
});

app.post('/delete/:id',async (req,res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `DELETE FROM spendings 
             WHERE id = ?`,
            [req.params.id],
        );
        res.redirect('/index');
    }catch (err) {
        console.error(err);
    }
});

app.post('/lm-delete/:id',async (req,res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `DELETE FROM spendings 
             WHERE id = ?`,
            [req.params.id],
        );
        res.redirect('/last-month');
    }catch (err) {
        console.error(err);
    }
});


app.get('/edit/:id',async (req, res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `SELECT * FROM spendings
             WHERE id = ?`,
            [req.params.id],
        );
        const [members] = await conn.query(
            `SELECT *
             FROM members`
        ); 
        res.render('edit.ejs',{spending: results[0],members});
    }catch (err) {
        console.error(err);
    }
});

app.post('/update/:id',async (req, res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `UPDATE spendings 
             SET date = ?, category = ?, detail = ?, price = ?, name = ?, payment = ? 
             WHERE id=?`,
            [
                req.body.spendingDate,
                req.body.spendingCategory,
                req.body.spendingDetail,
                req.body.spendingPrice,
                req.body.spendingName,
                req.body.spendingPayment,
                req.params.id
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
});

app.get('/members',async (req,res) =>{
    const conn = await connection
    try{
        const [results] = await conn.query(`
        SELECT *
        FROM members
        `)
    res.render('members.ejs', {members: results});
    }catch (err) {
        console.error(err);
    }            
});

app.get('/personal/:id',async (req,res) =>{
    const conn = await connection;
    try{
        const [member] = await conn.query(`
            SELECT *
            FROM members
            WHERE id = ?`,
            [req.params.id],
        );

        const [addResults] = await conn.query(`
            SELECT SUM(price) AS sum
            FROM spendings
            JOIN members
            ON spendings.name = members.name
            WHERE members.id = ?
            AND payment='-'
            AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')`,
            [req.params.id],
        );

        const [addSpendings] = await conn.query(`
            SELECT *
            FROM spendings
            JOIN members
            ON spendings.name = members.name
            WHERE members.id = ?
            AND payment='-'
            AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')
            ORDER BY date DESC, spendings.id DESC`,
            [req.params.id],
        );

        const [subResults] = await conn.query(`
            SELECT SUM(price) AS sum
            FROM spendings
            JOIN members
            ON spendings.name = members.name
            WHERE members.id = ?
            AND payment='○'
            AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')`,
            [req.params.id],
        );

        const [subSpendings] = await conn.query(`
            SELECT *
            FROM spendings
            JOIN members
            ON spendings.name = members.name
            WHERE members.id = ?
            AND payment='○'
            AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(NOW(),'%Y%m')
            ORDER BY date DESC, spendings.id DESC`,
            [req.params.id],
        );
        res.render('personal.ejs',{member, add: addResults[0].sum, addSpendings, sub: subResults[0].sum, subSpendings});
    }catch (err) {
        console.error(err);
    }
});

app.get('/lm-personal/:id',async (req,res) =>{
    const conn = await connection;
    try{
        const [member] = await conn.query(`
            SELECT *
            FROM members
            WHERE id = ?`,
            [req.params.id],
        );

        const [addResults] = await conn.query(`
            SELECT SUM(price) AS sum
            FROM spendings
            JOIN members
            ON spendings.name = members.name
            WHERE members.id = ?
            AND payment='-'
            AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')`,
            [req.params.id],
        );

        const [addSpendings] = await conn.query(`
            SELECT *
            FROM spendings
            JOIN members
            ON spendings.name = members.name
            WHERE members.id = ?
            AND payment='-'
            AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')
            ORDER BY date DESC, spendings.id DESC`,
            [req.params.id],
        );

        const [subResults] = await conn.query(`
            SELECT SUM(price) AS sum
            FROM spendings
            JOIN members
            ON spendings.name = members.name
            WHERE members.id = ?
            AND payment='○'
            AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')`,
            [req.params.id],
        );

        const [subSpendings] = await conn.query(`
            SELECT *
            FROM spendings
            JOIN members
            ON spendings.name = members.name
            WHERE members.id = ?
            AND payment='○'
            AND DATE_FORMAT(date,'%Y%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y%m')
            ORDER BY date DESC, spendings.id DESC`,
            [req.params.id],
        );
        res.render('lm-personal.ejs',{member, add: addResults[0].sum, addSpendings, sub: subResults[0].sum, subSpendings});
    }catch (err) {
        console.error(err);
    }
});

app.get('/member-new', (req, res) => {
    res.render('member-new.ejs');
});

app.post('/member-create',async (req, res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `INSERT INTO members(name,monthly) 
             VALUES(?,?)`,
            [req.body.memberName,req.body.memberMonthly]
        );
        res.redirect('/members');
    }catch (err) {
        console.error(err);
    }            
});

app.post('/member-delete/:id',async (req,res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `DELETE FROM members 
             WHERE id = ?`,
            [req.params.id],
        );
        res.redirect('/members');
    }catch (err) {
        console.error(err);
    }
});

app.get('/member-edit/:id',async (req, res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `SELECT * FROM members
             WHERE id = ?`,
            [req.params.id],
        );
        res.render('member-edit.ejs',{member: results[0]});
    }catch (err) {
        console.error(err);
    }
});

app.post('/member-update/:id',async (req, res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `UPDATE members 
             SET name = ?, monthly = ? 
             WHERE id=?`,
            [req.body.memberName,req.body.memberMonthly,req.params.id],
        );
        res.redirect('/members');
    }catch (err) {
        console.error(err);
    }
});

app.post('/past-data-delete',async (req,res) => {
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `DELETE FROM spendings 
             WHERE (date < DATE_SUB(CURDATE(), INTERVAL 3 MONTH))`,
        );
        res.redirect('/');
    }catch (err) {
        console.error(err);
    }
});

app.listen(3000);