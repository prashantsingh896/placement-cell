const mongoose  = require('mongoose');

//connect to MongoDB cloud URI
mongoose.connect(process.env.MONGO_URI);

//acquire the connection 
const db = mongoose.connection;

//if error
db.on("error", function(err){console.log(`Error in connecting to DB: ${err}`)});

//successfully conneted
db.once('open',()=>{
    console.log('Successfully connected to db');
});

//export
module.exports = db;