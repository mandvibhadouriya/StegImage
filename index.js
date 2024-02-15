const imageroutes = require('./routes/ImageRoutes');
const audioroutes = require('./routes/AudioRoutes');

const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const path = require('path')



app.set('view engine','ejs');
console.log(path.join(__dirname,'frontend/build'))
app.use(express.static(path.join(__dirname,'frontend/build')))
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Image Routes 

app.use(imageroutes);
app.use(audioroutes);

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'frontend/build','index.html'))
})


app.listen(3001);
console.log("The server is listening on 3001");


