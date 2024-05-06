const { faker } = require('@faker-js/faker');
const mysql=require('mysql2')
const express = require("express");
const app=express();
const path=require("path");
const  methodOverride=require("method-override")

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs");
//app.use("views",)

const connection=mysql.createConnection({
  host:'localhost',
  user:'root',
  database:'delta_app',
  password:'root'
})
let  getRandomUser=() => {
  return [
    faker.string.uuid(),
   faker.internet.userName(),
      faker.internet.email(),
    faker.internet.password(),
   
  ];
}
//inserting new data
//let q="insert into user (id,username,email,password) values ?";


/*
let data=[];
for(let i=0;i<100;i++){
  data.push(getRandomUser()) // 100 fake users data
 // console.log(getRandomUser());
}
*/





/*let users=[["123b","123_newuserb","abc@gmail.comb","abcb"],
["123c","123_newuserc","abc@gmail.comc","abcc"]
];

try{
  connection.query(q,[data],(err,result)=>{
    if (err) throw err;
    console.log(result);
   // console.log(result.length);

  });
}
catch(err){
  console.log(err);
}

connection.end();
*/


//HOME ROUTE
app.get("/",(req,res)=>{
 let q=`select count(*) from user`;
 try{
  connection.query(q,(err,result)=>{
    if (err) throw err;

    let count =result[0]["count(*)"]
    console.log(result[0]["count(*)"]);
   // res.send("success");
   // console.log(result.length);
    res.render("home.ejs",{
      count
    })
  });
}
catch(err){
  console.log(err);
  res.send("some error in database")
}
 // res.send("welcome to home page")
})



//SHOW ROUTE
app.get("/user",(req,res)=>{
let q=`select * from user`;
try{
  connection.query(q,(err,users)=>{
    if (err) throw err;
/*
   console.log(result);
   let data=result;*/
res.render("showusers.ejs",{users})
  });
}
catch(err){
  console.log(err);
  res.send("some error in database")
}

})



//edit user


app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q= `select * from user where id='${id}'`;
  
  try{
    connection.query(q,(err,result)=>{
      if (err) throw err;
      console.log(result);
      let user=result[0];
      res.render("edit.ejs",{user})
    });
  }
  catch(err){
    console.log(err);
    res.send("some error in database")
  }
 
})


//  edit / update route

//actual update of data in the database
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let {password:formpass,username:newUsername}=req.body
  let q= `select * from user where id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if (err) throw err;
    //  console.log(result);
      let user=result[0];
      if(formpass!=user.password){
        res.send("WRONG PASSWORD")
      }else{
        let q2=`update user set username='${newUsername}'where id='${id}'`
      
          connection.query(q2,(err,result)=>{
            if (err) throw err;
            
            res.redirect("/user")
          });
      
      }
  //    res.send(user)
    });
  }
  catch(err){
    console.log(err);
    res.send("some error in database")
  }
})


app.listen("3000",()=>{
  console.log("server is listening at port 3000")
})
// to open sql in cmd or (cli (command line interface))
// use mysql -u root -p
// it will ask enter password
// enter root(as it is the password we kept)
