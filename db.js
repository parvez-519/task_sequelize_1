const { Sequelize } = require('sequelize');
require('dotenv').config()

const db = new Sequelize('task7', 'root', 'root', {
  host: 'localhost',
  dialect: "mysql"
}
)

try {
  db.authenticate();
} catch (error) {
}

db.sync({}).then(() => {
})
// db.Sequelize = Sequelize
module.exports = db


