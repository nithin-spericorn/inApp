'use strict';


const db = require("../model")
//const u=require("../models/user")
const fs = require('fs');



try{
    let rawdata = fs.readFileSync('./databaseFeed/user.json');
let { users } = JSON.parse(rawdata);

console.log(users);

users.forEach(async (item) => {
    await db.User.create({
        name: item.name,
        email: item.email,
        password:item.password

    })
    
})


 


}catch(e){
    console.log("error ==>",e)
}

