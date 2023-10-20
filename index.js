
const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userName = process.env.DATA_USERNAME;
const password = process.env.DATA_PASSWORD;

function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

const uri = `mongodb+srv://${userName}:${password}@cluster0.evacz3b.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const brandsCollections = client.db("insertAssignmentNine").collection("brandsColloction");
    const productCollection = client.db("insertAssignmentNine").collection("productCollection");


    // all functionality for post, update and get products 
    app.get("/products/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        console.log(id);
        const result = await productCollection.findOne(query);
        res.send(result);
    })

    app.get("/products", async (req, res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();

        res.send(result);
    })

    app.get("/brands/:brandName", async (req, res) => {
        const name = capitalize(req.params.brandName);

        const query = {brandName : name};
        const cursor = productCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/brands", async (req, res) => {
        const courser = brandsCollections.find();
        const result = await courser.toArray();

        res.send(result);
    })

    app.get("/brand/:name", async (req, res) => {
        let name = req.params.name;

        const query = {name : name};
        const result = await brandsCollections.findOne(query);
        
        res.send(result);
    })


    app.post("/brands", async (req, res) => {
        const product = req.body;
        
        const result = await productCollection.insertOne(product);
        res.send(result);
    })

    app.patch("/products/:name", async(req, res) => {
        const name = req.params.name;
        const item = req.body;
        const filter = {name:  name};

        const updateItem = {
            $set: {
                name: item.name,
                brandName : item.brandName,
                type : item.type,
                rating : item.rating,
                description : item.description,
                price : item.price,
                image : item.image
            }
        }

        const result = await productCollection.updateOne(filter, updateItem);
        res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error thter is some err
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("hello world");
})

app.listen(port, () => {
    console.log("listening on port " + port);
})