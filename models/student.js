const mongoose = require('mongoose');

//连接数据库
mongoose.connect('mongodb://localhost/manageData', {useNewUrlParser: true});

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  firstName: {type: String, required: true, max:64},
  lastName: {type: String, required: true, max:64},
  nickName: {type: String, required: false, max:64},
  email: {type: String, required: true, max:512},
});

module.exports = mongoose.model("Student", studentSchema);

