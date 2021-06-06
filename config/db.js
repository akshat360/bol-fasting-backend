// const MongoClient = require('mongodb').MongoClient;
const uri =
  process.env.DATABASE ||
  `mongodb+srv://adminuser:adminuser@cluster0.svcwb.mongodb.net/boltFasting?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   const collection = client.db('test').collection('bolt-fasting');
//   // perform actions on the collection object
//   client.close();
// });
const mongoose = require('mongoose');

module.exports.connectDB = () => {
  try {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then((res) => {
        console.log('DB CONNECTED');
      })
      .catch((err) => {
        console.log('DB Not CONNECTED', err);
      });
  } catch (err) {
    console.log('DB Not CONNECTED', err);
  }
};
