const { DataTypes } = require('sequelize')
const db = require('../../db')
const dept = require('../entities/dept')
const books = require('../entities/books')

// module.exports = function (DataTypes) {
  let emp = db.define('emp', {
    emp_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    dept_id:{
      type: DataTypes.INTEGER,
      allowNull: true
    }

  }, 
  {
    tableName:'emp',
    freezeTableName: true,
    timestamps: false,
  })

  dept.hasOne(emp,{foreignKey:"dept_id",allowNull:true,onDelete: 'cascade',onUpdate: 'cascade' });
  emp.hasMany(books,{foreignKey:"emp_id",allowNull:true,onDelete: 'cascade',onUpdate: 'cascade' });
  emp.belongsTo(dept,{foreignKey:"dept_id"});
  books.belongsTo(emp,{foreignKey:"emp_id"});
  // emp.associate = function () {
  //   console.log('111111111111111111111');
  //   emp.belongsTo(dept, {
  //     foreignKey: 'dept_id'
  //   })
  // }
  // return emp
// }
 module.exports = emp
