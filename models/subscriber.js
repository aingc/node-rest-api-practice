const mongoose = require('mongoose'); //allow us to create a model to interact with the database in an easy way

const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subscribedToChannel: {
    type: String,
    required: true
  },
  subscribeData: {
    type: Date,
    required: true,
    default: Date.now
  }
});

//mongoose.model first param: name of model in db, 2nd param is schema that corresponds to that model
//we need this model function when we export and import in different file this model allows us to directly interact with the db using the above schema
module.exports = mongoose.model('Subscriber', subscriberSchema);