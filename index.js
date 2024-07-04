const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
});


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.h0zb1dz.mongodb.net/?appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const contactCollection = client.db("portfolio").collection("contact");

    app.post("/contact", async (req, res) => {
        const item = req.body;

        mg.messages.create('sandbox-123.mailgun.org', {
          from: "Excited User <mailgun@sandboxa4c0d0b3312e4e4d99731d9d7a894c51.mailgun.org>",
          to: ["mahbubsarwar5@gmail.com"],
          subject: "New Message from Your Portfolio Website",
          html: 
          `<h3>Name: ${item.name}</h3>
           <h3>Email: ${item.email}</h3>
           <p>Message: ${item.message}</p>
          `
        })
        .then(msg => console.log(msg)) // logs response data
        .catch(err => console.log(err));

        const result = await contactCollection.insertOne(item);
        res.send(result);
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("My Portfolio is Working...");
});

  
app.listen(port, () => {
    console.log("Portfolio is working on port", port);
});
  