const mongoose = require('mongoose');

//连接数据库
mongoose.connect('mongodb://localhost/jwtData', {useNewUrlParser: true});

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {type: String, required: true, max:64},
  lastName: {type: String, required: true, max:64},
  email: {type: String, required: true, max:512},
  password: {type: String, required: true, max:70},
  isAdmin: {type: Boolean, required: true, default:false},
});

module.exports = mongoose.model("User", userSchema);

