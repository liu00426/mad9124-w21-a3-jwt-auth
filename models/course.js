const mongoose = require('mongoose');

//连接数据库
mongoose.connect('mongodb://localhost/manageData', {useNewUrlParser: true});

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  code: {type: String, required: true, max:16},
  title: {type: String, required: true, max:255},
  description: {type: String, required: false, max:2048},
  url: {type: String, required: false, max:512},
  students: {type: Array, required: false},
});

module.exports = mongoose.model("Course", courseSchema);

