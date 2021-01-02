const express = require('express');
const subscriber = require('../models/subscriber');
const router = express.Router();
const Subscriber = require('../models/subscriber');

// Getting all subs
router.get('/', async ( req, res) => {
  try {
    const subscribers = await Subscriber.find()
    res.json(subscribers)
  } catch (err) {
    //500 means error on our server means the actual server, in our case our db had some sort of error which caused the actual transaction not to work and it had nothing to do with the user or client using the api, entirely our fault
    //any error in the 500 range means that
    res.status(500).json({ message: err.message }); //becasue this is a json api
  }
});
// Getting one sub
//:id means its a param that we can access with 'req.params', this would give us access to whatever they pass in after the first slash
router.get('/:id', getSubscriber, (req, res) => {
  //since we have this getSubscriber middleware this will get the name of the sub and send it back to us
  //this is just for testing purposes
  //res.send(res.subscriber.name);
  res.json(res.subscriber);
});

// Create one sub
router.post('/', async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel
  });

  try {
    const newSubscriber = await subscriber.save()
    //201 means successfully created an object, its a more specific way to say that you created something
    //always want to make sure to send 201 with a post
    res.status(201).json(newSubscriber)
  } catch (err) {
    //this will fail if user doesn't pass name or subscribedToChannel, whenever user gives bad data, you want
    //to send a 400 error because that means something wrong with user input and not something wrong with server
    res.status(400).json({ message: err.message });
  }
});

// Updating one sub
//doing patch instead of put because we only want to update what the user passes us specifically, if we use put then we'd update all sub info all at once instead of just the info that gets passsed
router.patch('/:id', getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name
  }

  if (req.body.subscribedToChannel != null) {
    //updating to what is passed in from req.body
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel
  }

  try {
    //will gives us updated ver of subscriber if they successfully saved
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber)
  } catch {
    //400 instead of 500 because it's their fault not ours
    res.status(400).json({ message: err.message })
  }
});


// Deleting one sub
router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();//if it fails we will get an error
    res.json({ message: 'Deleted Subscriber' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

//middleware function
//next param is a function which is a callback, "next section of our code, if this function is run"
//async because we access db in this func
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id)
    if (subscriber == null) {
      //404 means we could not find something, in this case couldn't find subscriber
      //we call return here is because if there is no sub then we want to immediately leave this func
      //and no longer go any further
      return res.status(404).json({ message: 'Cannot find subscriber' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  //this way inside of all these other functions we can just call res.subscriber,
  //which will be the subscriber we set in here
  res.subscriber = subscriber;
  next();// move onto the next piece of middleware or the actual request itself
}

module.exports = router;