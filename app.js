const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const connection = require('./route/dbConnect.js');
const m = require('./route/today.js'); 
const auth = require('./route/auth.js');
const index = require('./route/index.js');
const edit = require('./route/edit.js');
const members = require('./route/members.js');
const memberEdit = require('./route/member-edit.js');
const personal = require('./route/personal.js');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(
    session({
      secret: 'my_secret_key',
      resave: false,
      saveUninitialized: false,
    })
  );

app.use((req,res,next) => {
    if (req.session.userId === undefined) {
        res.locals.username = 'ゲスト';
        res.locals.isLoggedIn = false;
    } else {
        res.locals.username = req.session.username;
        res.locals.isLoggedIn = true;
    }
    next();
});

//ユーザー認証//

app.get('/', (req, res) => {
    res.render('top.ejs');
});
  
app.use('/', auth); 

app.use((req,res,next) => {
    if (req.session.userId === undefined) {
            res.redirect('/')
    } else {
        next();
    }        
});

//一覧表示//

app.use('/', index);

//一覧編集（追加・編集・削除）//

app.use('/', edit);

//メンバー一覧//

app.use('/', members);

//メンバー編集//
app.use('/', memberEdit);

//個別支出一覧//
app.use('/', personal);

app.post('/past-data-delete',async (req,res) => {
    const userId = req.session.userId;
    const conn = await connection;
    try{
        const [results] = await conn.query(
            `DELETE FROM spendings 
             WHERE (date < DATE_SUB(CURDATE(), INTERVAL 3 MONTH))
             AND user_id = ?`,
             [userId]
        );
        res.redirect('/');
    }catch (err) {
        console.error(err);
    }
});


app.listen(80);