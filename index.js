
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
// require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pass='2tFukBx5QOK5AYLF';
const user='dbUser';
const uri=process.env.DB_PATH;
//const uri = "mongodb+srv://dbUser:2tFukBx5QOK5AYLF@cluster0-ezexp.mongodb.net/dbUser?retryWrites=true&w=majority"; 

// process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });
const users = ["Asad", 'Moin', 'Sabed', 'Susmita', 'Sohana', 'Sabana'];


app.get('/products', (req, res) =>{
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
});

app.get('/product/:key', (req, res) =>{
    const key = req.params.key;    
    
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key:key}).toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents[0]);
            }
        });
        client.close();
      });
});

app.post('/getProductsKeys', (req, res) =>{
    const key = req.params.key;    
    const productKeys = req.body;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key:{ $in: productKeys }}).toArray((err, documents)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
      });
});


app.post('/placeOrder', (req, res) => {
    const orderDetails = req.body;
    orderDetails.oderTime = new Date();
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("cart");
        collection.insertOne(orderDetails, (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
      });
});


//delete
//update
// post
app.post('/addProduct', (req, res) => {
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insert(product, (err, result)=>{
            if(err){
                console.log(err)
                res.status(500).send({message:err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
      });
});

// const port = process.env.PORT || 4200;
app.listen(4200, () => console.log('Listenting to port 4200'));
