const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

// MiddleWare
require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyyvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("CreativeAgency");
    const portfolio = database.collection("portfolio");
    const pricing = database.collection("pricing");
    const orderlist = database.collection("orderlist");
    const reviewlist = database.collection("reviewlist");

    // Get pricing data
    app.get("/pricing", async (req, res) => {
      const pricingData = pricing.find({});
      const result = await pricingData.toArray();
      res.json(result);
    });

    // get single pricing data
    app.get("/pricing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await pricing.findOne(query);
      res.json(result);
    });

    // Post new order in order
    app.post("/orderlist", async (req, res) => {
      const info = req.body;
      const result = await orderlist.insertOne(info);
      res.json(result);
    });

    // Get specific single user orders
    app.get("/orderlist/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const findData = orderlist.find(query);
      const result = await findData.toArray();
      res.json(result);
    });

    // Post a review
    app.post("/reviewlist", async (req, res) => {
      const info = req.body;
      const result = await reviewlist.insertOne(info);
      res.json(result);
    });

    // get all review
    app.get("/reviewlist", async (req, res) => {
      const reviewData = reviewlist.find({});
      const result = await reviewData.toArray();
      res.json(result);
    });

    // Get portfolios
    app.get("/portfolio", async (req, res) => {
      const portfolioData = portfolio.find({});
      const result = await portfolioData.toArray();
      res.json(result);
    });

    // get specific portfolio data
    app.get("/portfolio/:id", async (req, res) => {
      let id = req.params.id;
      const query = { id };
      const findData = portfolio.find(query);
      const result = await findData.toArray();
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Creative Agency Server is Running");
});

app.listen(port, () => {
  console.log(`Creative Agency is Running`);
});
