const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//config
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'https://art-alley.web.app',
            'https://art-alley.firebaseapp.com',
        ],
    })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rocppxe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        const artCollection = client.db('artStore').collection('arts');

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db('admin').command({ ping: 1 });

        app.post('/addArt', async (req, res) => {
            const artInfo = req.body;
            const result = await artCollection.insertOne(artInfo);
            res.send(result);
        });

        app.get('/allArts', async (req, res) => {
            const result = await artCollection.find().toArray();
            res.send(result);
        });

        app.get('/allArts/:_id', async (req, res) => {
            const result = await artCollection.findOne({
                _id: new ObjectId(req.params._id),
            });
            res.send(result);
        });

        app.get('/myArt/:email', async (req, res) => {
            const result = await artCollection
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
        });

        app.get('/subcategory/:category', async (req, res) => {
            const result = await artCollection
                .find({
                    subcategory: req.params.category,
                })
                .toArray();
            res.send(result);
        });

        app.patch('/update/:_id', async (req, res) => {
            const data = req.body;
            const filter = { _id: new ObjectId(req.params._id) };
            const updateArt = {
                $set: {
                    imageUrl: data.imageUrl,
                    itemName: data.itemName,
                    subcategory: data.subcategory,
                    description: data.description,
                    price: data.price,
                    rating: data.rating,
                    processTime: data.processTime,
                    customization: data.customization,
                    stockStatus: data.stockStatus,
                },
            };
            const result = await artCollection.updateOne(filter, updateArt);
            res.send(result);
        });

        app.delete('/delete/:_id', async (req, res) => {
            const _id = req.params._id;
            const query = { _id: new ObjectId(_id) };
            const result = await artCollection.deleteOne(query);
            res.send(result);
        });

        console.log(
            'Pinged your deployment. You successfully connected to MongoDB!'
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Art Alley server is running');
});

app.listen(port, () => {
    console.log(`Art Alley server is listening at ${port}`);
});
