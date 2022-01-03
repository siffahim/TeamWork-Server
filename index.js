const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

//Middle ware
app.use(cors())
app.use(express.json())


//connect on mongodb user
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyhqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect()

        const database = client.db('StrategyTech')
        const courseCollection = database.collection('courses')

        app.get('/courses', async (req, res) => {
            const cursor = courseCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        app.get('/courses/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await courseCollection.findOne(filter)
            res.json(result)
        })


    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('I m Strategy server')
})

app.listen(port, () => {
    console.log('Running Strategy', port)
})