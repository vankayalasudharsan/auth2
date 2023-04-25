const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const app = express()

const bcrypt = require("bcrypt");

const port = 3000

app.listen(port, () => {
    console.log("server Running")
})

let db = new sqlite3.Database(":memory", (error => {

    if (error) {
        console.log(error.message)
    }
    else {
        console.log("successfully conected to the database ");
    }
}))

app.get("/", async (request, response) => {
    response.send("hi user server started")

});

/*app.get("/login",async (request,response)=>{
    const {name,password} = request.body;
    const isuserexitQuery = `SELECT * FROM appUsers WHERE name = ${name};`
    const user = await db.get(isuserexitQuery);
    if(user === undefined){
        response.status(400)
        response.send("invalid username")

    }else{
        const ispasswordMatched = await bcrypt.compare(password,user.password)
        if(ispasswordMatched){
            response.status(200)
            response.send("login successfull")
        }else{
            response.status(401)
            response.send("invalid password")
        }
    }
     
})*/

app.post("/register", async (request, response) => {
   
    const{name,age,password} = request.body;
    const encryptedpassword = await bcrypt.hash(password, 10)
    
    const isusernameexistquery = `SELECT * FROM users WHERE name LIKE ${name};`
    const isusernameexist = await db.get(isusernameexistquery)
    if (isusernameexist.name === name) {
        response.status(400)
        response.send("user name already exit")

    } else {
        const query = `INSERT INTO users(name,age,password) VALUES(${name},${age},${encryptedpassword});`
        await db.run(query)
        response.send("user registered successfully")

    }

})

app.get("/users",async(request,response)=>{
    const quey = `select * from appUsers;`
    const users = await db.get(quey)
    response.send(users)
})