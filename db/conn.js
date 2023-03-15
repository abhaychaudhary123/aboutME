const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

mongoose.connect("mongodb://127.0.0.1/shoestore",{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(() => {
    console.log(`Connection Successful`);
})
.catch((err) => {
    console.log(`Failed to Connect : ${err}`);
})