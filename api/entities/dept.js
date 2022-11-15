const {DataTypes} = require('sequelize')
 const db = require('../../db')
 const emp=require('../entities/emp')

// module.exports = function () {

  let dept = db.define('dept', {
    dept_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    dept_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {
    tableName:'dept',
    freezeTableName: true,
    timestamps: false,
  })
  // console.log('dept-------------',dept);
  // dept.hasOne(emp,{foreignKey:"dept_id",onDelete: 'cascade' });
  // dept.associate = function () {
  //   dept.hasOne(emp, {
  //     foreignKey: 'dept_id'
  //   })
  // }
  // return dept

// }
module.exports = dept
