const express = require('express')
const app = express()
const port = 5500
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID;



app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4tdw4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("Car").collection("brand");
    console.log('mongo err kaise', err);
    const order = client.db("Car").collection("orders");

    app.post('/AddCar', (req, res) => {
        const eventDetails = req.body;
        productCollection.insertOne(eventDetails)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/BookCars', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/BookCars/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })


    // Login and see order code 


    app.get('/orders', (req, res) => {
        order.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get(`/allUsers`, (req, res) => {
        order.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    app.post('/AddOrder', (req, res) => {
        const registrationsDetails = req.body;
        order.insertOne(registrationsDetails)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })


    app.delete('/cancleOrder/:id', (req, res) => {
        order.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                console.log(result, 'main deleted');
                res.send(result.deletedCount > 0);
            })
    })

    app.delete('/BookCars/:id', (req, res) => {
        productCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
                console.log(result, 'Admin data deleted');

            })
    })

});

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
// })
app.listen(process.env.PORT || port)
