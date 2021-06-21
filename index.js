const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId







const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xflby.mongodb.net/${process.env.DB_COLLECTION}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const products = client.db("MoslaStore").collection("product");
    const oders = client.db("MoslaStore").collection("oder");



    app.post('/addProduct', (req, res) => {
        const product = req.body;
      products.insertOne(product)
      .then(result =>{
        console.log(result.ops)
          res.json(result.insertedCount > 0)
      })
    })

    app.get('/products', (req, res) => {
        products.find({})
        .toArray((err, documents) => {
          res.send(documents)
        })
      })

      app.get('/product/:id', (req, res) => {
        products.find({_id:ObjectId(req.params.id)})
        .toArray((err, documents)=>{
          res.send(documents[0])
        })
      })

      app.delete('/delete/:id', (req, res) => {
        products.deleteOne({_id:ObjectId(req.params.id)})
        .then( result =>{
          console.log(result)
        })
    })
    
    app.post('/oder', (req, res) => {
      const oder = req.body;
    oders.insertOne(oder)
    .then(result =>{
      console.log(result.ops)
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/oderDetails', (req, res) => {
    oders.find({email: req.query.email})
   .toArray((err, documents) => {
     res.send(documents)
   })
 })
 
    console.log("Database")

});



app.listen(process.env.PORT || port, () => {
})