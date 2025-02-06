const express = require('express');
const app = express();
const path = require("path");
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"college",
    password:"Qwertyuiop"
});

// let getRandomUser = ()=> {
//     return [
//         faker.string.uuid(),
//         faker.internet.username(),
//         faker.internet.email(),
//         faker.internet.password(),
//     ];
// }


// let q = "insert into student (id, name, email, password) values ?";

// let data = [];
// for(let i=1;i<=2;i++){
//     data.push(getRandomUser());
// }
 
// try{
//     connection.query(q,[data],(err,res)=>{
//         if (err) throw err;
//         console.log(res);
//     });
// }catch(err){
//     console.log(err);
// }


app.get("/",(req,res)=>{
    let q = "select count(*) from student";
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let count = result[0]["count(*)"];
            res.render('home.ejs',{count});
        })
    }catch(err){
        res.send(`No Data Found`)
    }
});

//View all data
app.get("/users",(req,res)=>{
    let q = "select * from student";
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let usersData = result;
            res.render("allusers.ejs",{usersData})
        });
    }catch(err){
        res.send(`Oops Error in Server to Fetch data`)
    }
})

//add new form open
app.get("/users/add",(req,res)=>{
    res.render("newUser.ejs");
})

//add new user data  
app.post("/users/add",(req,res)=>{
    let {name , email , password} = req.body;
    let id = uuidv4();
    let q = `insert into student (id, name, email, password) values ("${id}","${name}","${email}","${password}")`;
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            res.redirect("/users");
        });
    }catch(err){
        res.send(`Sorry Data Not Enter Some error occur in server`);
    }
})



//Open Form of Update Data
app.get("/users/:id",(req,res)=>{
    let {id} = req.params;
    let q = `select * from student where id="${id}"`;
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            let IdvData = (result[0]);
            res.render("edit.ejs",{IdvData})
        });
    }catch(err){
        res.send(`Oops Error in Server to Fetch data`);
    }
})

//Update Data
app.put("/users/:id",(req,res)=>{
    let {id} = req.params;
    let newData = req.body;
    let q = `update student set name = "${newData.name}" , email = "${newData.email}" where id = "${id}"`;
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            res.redirect("/users");
        });
    }catch(err){
        res.send(`Oops Error in Server to Fetch data`);
    }
})

//Delete Data
app.delete("/users/:id",(req,res)=>{
    let {id} = req.params;
    let q = `delete from student where id = "${id}"`;
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err;
            res.redirect("/users");
        });
    }catch(err){
        res.send(`Oops Data is Not deleting Error in Server....`);
    }
})




app.use(express.static(path.join(__dirname,"public")))
app.set("views",path.join(__dirname,"/views"));
app.listen(8080,()=>{
    console.log("Listening on Port 8080");
})

