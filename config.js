const dotenv = require('dotenv');
dotenv.config();
const { HOST_URI, JWT_SECRET, PORT } = process.env;
module.exports = {
  HOST_URI,
  JWT_SECRET,
  PORT,
};
