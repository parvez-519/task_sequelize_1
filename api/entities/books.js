const { DataTypes } = require('sequelize')
const db = require('../../db')
const emp=require('../entities/emp')

// module.exports = function (DataTypes) {
  let books = db.define('books', {
    book_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    book_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    book_author: {
        type: DataTypes.STRING,
        allowNull: true
      },
    emp_id:{
      type: DataTypes.INTEGER,
      allowNull: true
    }

  }, 
  {
    tableName:'books',
    freezeTableName: true,
    timestamps: false,
  });

  // emp.hasMany(books,{foreignKey:"emp_id",allowNull:true,onDelete: 'cascade' });
  // books.belongsTo(emp,{foreignKey:"emp_id"});

  // emply.associate = function () {
  //   console.log('111111111111111111111');
  //   emply.belongsTo(dept, {
  //     foreignKey: 'dept_id'
  //   })
  // }
  // return emp
// }
 module.exports = books
