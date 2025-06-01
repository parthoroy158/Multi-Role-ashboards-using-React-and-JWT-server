const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.qbyxney.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const licheeCollection = client.db("lichee_sell").collection("lichee_collection");
        const cartCollection = client.db("lichee_sell").collection("cart_collection");
        const userCollection = client.db("lichee_sell").collection("user_collection");

        app.get('/lichees', async (req, res) => {
            const query = req.body;
            const result = await licheeCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/cart', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await cartCollection.find(query).toArray(); 
            res.send(result);
        });


        app.get('/cart', async (req, res) => {
            const query = req.body;
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/lichees', async (req, res) => {
            const query = req.body;
            const result = await cartCollection.insertOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('This is the lichee server')
})

app.listen(port, () => {
    console.log(`This is the server port:${port}`)
})
