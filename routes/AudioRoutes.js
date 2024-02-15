const express = require('express');
const multer = require('multer');
const fileSystem=require('fs');
let nameoffile;
const path = require('path')
const { PythonShell } = require ('python-shell');
const bodyParser = require('body-parser');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename: (req,file,cb)=>{
        console.log(file)
        nameoffile= Date.now()+path.extname(file.originalname)
        cb(null,nameoffile)
    }
})

const upload = multer({storage:storage})

var urlencodedParser = bodyParser.urlencoded({extended:false})
const  router = express.Router();



router.post('/audio/encode',urlencodedParser,upload.single('file'),(req,res)=>{
    console.log(req.body.password+" "+req.body.message);
    console.log(nameoffile);
    let options = {
        mode : 'text',
        pythonOptions:['-u'],
        scriptPath:path.join(__dirname.replace('routes','uploads\\')),
        args:[nameoffile,req.body.message,req.body.password]
    }
    PythonShell.run('AudioEncoder.py',options,function(err,results){
        if(err)throw err;
        console.log(results);
    })
    res.send(`http://localhost:3001/encaudio/enc${nameoffile}`);
});

// Decoding Section 

router.post('/audio/decode',urlencodedParser,upload.single('file'),(req,res)=>{
    console.log(req.body.password);
    console.log(nameoffile);
    let options = {
        mode : 'text',
        pythonOptions:['-u'],
        scriptPath:path.join(__dirname.replace('routes','uploads\\')),
        args:[nameoffile,req.body.password]
    }
    PythonShell.run('AudioDecoder.py',options,function(err,results){
        if(err)throw err;
        console.log(results[0]);
        res.send(results[0]);
    })
});


router.get('/encaudio/:audioname',(req,res)=>{
    filename=req.params.audioname;
    console.log(filename)
    res.download(path.join(__dirname.replace('routes','uploads\\'))+filename,(error)=>{
        console.log(error);
    });
});
module.exports = router 