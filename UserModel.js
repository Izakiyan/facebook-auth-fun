var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: String,
  username: String,
  displayName: String,
  name:
   { familyName: String,
     givenName: String,
     middleName: String },
  gender: String,
  profileUrl: String,
  photos: [ { value: String } ],
  provider: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;