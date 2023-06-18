const express = require('express')
const app = express();

// app.get('/', (req,res) => {
//     console.log('toko');
// })

// require database connection 
const dbConnect = require("./database/connection");

// execute database connection 
dbConnect();


app.listen(3000);
console.log("attente de requete");