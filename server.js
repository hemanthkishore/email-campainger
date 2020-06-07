const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');

const campaigns = require("./routes/api/campaigns");

const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cors());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/campaigns", campaigns);

// serve static assests
if (process.env.NODE_ENV === "production") {
  app.use(express.static('client/build'));
  app.get("*", (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
