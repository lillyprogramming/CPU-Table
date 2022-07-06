const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: "password",
    database: "cpus",
})

app.post('/', (req,res) => {
    const brand = req.body.brand;
    const model = req.body.model;    
    const socket = req.body.socket;
    const clockspeed = req.body.clockspeed;
    const cores = req.body.cores;
    const threads = req.body.threads;
    const TDP = req.body.TDP;
    const price = req.body.price;

    const sqlInsert = 
    "INSERT INTO cputable (brand, model, socket, clockspeed, cores, threads, TDP, price) VALUES (?,?,?,?,?,?,?,?)";
    db.query(sqlInsert,
    [brand, model, socket, clockspeed, cores, threads, TDP, price], (err, result) => {
        res.sendStatus(200);
    }
    );
});

app.get('', (req,res) => {
    db.query("SELECT * FROM cputable", (err, result)=>{
        res.send(result);
    });
})

app.put('/:id',(req,res)=> {
    const brand = req.body.brand;
    const model = req.body.model;    
    const socket = req.body.socket;
    const clockspeed = req.body.clockspeed;
    const cores = req.body.cores;
    const threads = req.body.threads;
    const TDP = req.body.TDP;
    const price = req.body.price;
    const id = req.params.id;
    const sqlEdit = 
    "UPDATE cputable SET brand = ?, model = ?, socket = ?, clockspeed = ?, cores = ?, threads = ?, TDP = ?, price = ? WHERE id = ?";
    db.query(sqlEdit, [brand, model, socket, clockspeed, cores, threads, TDP, price, id], (err, result) => {
        res.sendStatus(200);
    });
})

app.delete('/:id', (req, res) => {
    const id= req.params.id;
    const sqlDelete = `DELETE FROM cputable WHERE id = ?`;
    db.query(sqlDelete, id, (err,result) => {
        res.sendStatus(200);
    });
})

app.listen(3001, ()=> {
    console.log("Your server is running.");
});
 