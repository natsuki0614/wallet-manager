const express = require('express');
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs');

const connection = require('./dbConnect.js');

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

router  
    .get('/signup',(req,res) => {
        res.render('signup.ejs',{errors:[]});
    })

    .post('/signup',
        (req, res, next) => {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const errors = [];

            if (username === '') {
            errors.push('ユーザー名が空です');
            }

            if (email === '') {
            errors.push('メールアドレスが空です');
            }

            if (password === '') {
            errors.push('パスワードが空です');
            }

            if (errors.length > 0) {
            res.render('signup.ejs',{errors:errors});
            
            } else {
            next();
            }
        }, 
        async(req, res, next) => {
            const email = req.body.email;
            const errors = [];
            const conn = await connection;
            try{
                const [results] = await conn.query(`
                SELECT * FROM users WHERE email = ?`,
                [email]);
                if (results.length > 0) {
                    errors.push('このメールアドレスはすでに登録されています');
                    res.render('signup.ejs', { errors: errors });
                } else {
                    next();
                }
            }catch (err) {
                console.error(err);
            }  
        },   
        (req,res)=>{
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            bcrypt.hash(password,10,async(error,hash) => {
                const conn = await connection;
                try{
                    const [results] = await conn.query(`
                        INSERT INTO users (username, email, password)
                        VALUES (?, ?, ?)`,
                        [username, email, hash]
                    );
                    req.session.userId = results.insertId;
                    req.session.username = username;
                    res.redirect('/');
                }catch (err) {
                    console.error(err);
                }
            });       
    })

    .get('/login',(req,res) =>{
        res.render('login.ejs',{email:[],errors:[]});
    })

    .post('/login',async(req,res) => {
        const email = req.body.email;
        const errors = [];
        const conn = await connection;
        try{
            const [results] = await conn.query(`
                SELECT *
                FROM users
                WHERE email = ?`,
                [email]      
            );
            if(results.length > 0){
                const plain = req.body.password;
                const hash = results[0].password;

                bcrypt.compare(plain,hash,(error,isEqual) =>{
                    if(isEqual){    
                        req.session.userId = results[0].id;
                        req.session.username = results[0].username;
                        res.redirect('/');
                    }else{
                        errors.push('パスワードが間違っています');
                        res.render('login.ejs',{email:email,errors:errors});
                    }
                });
            }else{
                errors.push('メールアドレスが間違っています');
                res.render('login.ejs',{email:email,errors:errors});
            }

        }catch (err) {
            console.error(err);
        }
    })

    .get('/logout',(req,res) => {
        req.session.destroy((error) => {
        res.redirect('/');
        });
    })

    

module.exports = router;