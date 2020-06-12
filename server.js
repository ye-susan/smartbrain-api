const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: { 
        host : '127.0.0.1',
        user : 'postgres',
        password : '',
        database : 'smartbrain'
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    //print to see what users we have
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    //testing purposes currently
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;   
    
    //in Postman, we'll send in this user as an example
    /**
     * {
     *     "email": "ann@gmail.com",
     *     "password": "apples",
     *     "name": "Ann"
     * }
     */

    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
        . catch(err => res.status(400).json('unable to register'));
})

app.get ('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not found');
            }
        })
    .catch(err => res.status(400).json('Error getting user'));
})

app.put ('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
    .catch(err => res.status(400).json('Unable to get entries.'))
})

app.listen(3000, () => {
    console.log('App is running on port 3000');
})