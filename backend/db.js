const mongoose = require('mongoose');
const mongoURI = "mongodb://0.0.0.0:27017/inotebook";

connectToMongo().catch(err => console.log(err));


async function connectToMongo() {
  await mongoose.connect(mongoURI);
  console.log("Connected to Mongo Successfully");
}
module.exports = connectToMongo;

// const mongoURI = "mongodb://localhost:27017";

// const connectToMongo = ()=>{
//   mongoose.connect(mongoURI,()=>{
//       console.log("Connected to Mongo successfully");
//   })
// }

// module.exports = connectToMongo;

