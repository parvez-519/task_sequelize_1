const {Sequelize}=require('sequelize');
require('dotenv').config()

const db=new Sequelize('task7','root','root',{
        host:'localhost',
        dialect:"mysql"
    }
)

try {
     db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

db.sync({}).then(()=>{
    console.log("migration running succesfully");
})
// db.Sequelize = Sequelize
module.exports=db


