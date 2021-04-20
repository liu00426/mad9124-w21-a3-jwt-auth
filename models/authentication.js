const mongoose = require('mongoose');

//连接数据库
mongoose.connect('mongodb://localhost/manageData', {useNewUrlParser: true});

const Schema = mongoose.Schema;

const authenticationSchema = new Schema({
  username: {type: String, required: true, max:64},
  ipAddress	: {type: String, required: true, max:64},
  didSucceed: {type: Boolean	, required: true},
  createdAt: {type: Date, required: true},
});

module.exports = mongoose.model("Authenticatio", authenticationSchema);

