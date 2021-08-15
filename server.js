const express = require('express');
const { MongoClient } = require('mongodb');
const mongodb = require('mongodb').ObjectId;
const sanitizeHTML = require('sanitize-html');


const app = express();
let db;
let port = process.env.PORT;
if (port === null || port === "") {
  port = 3000
};

app.use(express.static('public'))

const connectionString = 'mongodb+srv://todoAppUser:Test1234@cluster0.zrpud.mongodb.net/todoApp?retryWrites=true&w=majority';
MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedtopology: true }, (err, client) => {
  db = client.db();
  app.listen(port)
});

app.use(express.json())
app.use(express.urlencoded({extended: false}));

const passWordProtected = (req, res, next) => {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo APP"');
  console.log(req.headers.authorization)
  if (req.headers.authorization === "Basic dXNlcjpUZXN0MTIzNA==") {
    next()
  } else {
    res.status(401).send("Authentication Required")
  } 
};

app.use(passWordProtected)

app.get('/', (req, res) => {
  db.collection('items').find().toArray((err, items) => {
    res.send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">
      <h1 class="display-4 text-center py-1">To-Do App</h1>
      
      <div class="jumbotron p-3 shadow-sm">
        <form action="/create-item" method="POST">
          <div class="d-flex align-items-center">
            <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
          </div>
        </form>
      </div>
      
      <ul class="list-group pb-5">
        ${items.map(item => {
          return ` <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">${item.text}</span>
          <div>
            <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
        </li>`
        }).join('')}
      </ul>
      
    </div>
    
  </body>

  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
  </html>`)
  });
});

// create new item
app.post('/create-item', (req, res) => {
  const safeText = sanitizeHTML(req.body.item, {allowedTags: [], allowedAttributes: {}}) 
  db.collection('items').insertOne({ text: safeText }, () => {
    res.redirect('/');
  });
});

// update item
app.post('/update-item', (req, res) => {
  const safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('items').findOneAndUpdate({ _id: new mongodb(req.body.id) }, { $set: { text: safeText } }, () => {
    res.redirect('/');
  });
});

// Delete an Item
app.post('/delete-item', (req, res) => {
  db.collection('items').deleteOne({ _id: new mongodb(req.body.id) }, () => {
    res.redirect('/');
  });
});
