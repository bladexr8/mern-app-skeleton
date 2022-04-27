import path from 'path'
import 'dotenv/config'
import express from 'express'
import { MongoClient } from 'mongodb'
import template from './../template'
//comment out before building for production
import devBundle from './devBundle'

const app = express()
//comment out before building for production
devBundle.compile(app)

const CURRENT_WORKING_DIR = process.cwd()
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

app.get('/', (req, res) => {
  res.status(200).send(template())
})

let port = process.env.PORT || 3000
app.listen(port, function onStart(err) {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', port)
})

// Troubleshoot "MongoServerSelectionError"
// https://baraksaidoff.medium.com/fixing-mongoserverselectionerror-while-connecting-mongodb-with-node-js-213aaf0bf596

// Database Connection URL
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernSimpleSetup'
// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },(err, db)=>{
    //console.log(`Connect = ${url}`)
    console.log('***Connecting to MongoDB...');
    
    if (err) {
        console.log("Mongo Connection Error!")
        console.log(err)
    }
    
    if (db) {
        console.log("Connected successfully to mongodb server")
        db.close();
    }
  
  
  
})