const express = require('express');
const multer = require('multer');
let nameoffile;
const { PythonShell } = require ('python-shell');
const bodyParser = require('body-parser');
const path = require('path')
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




router.post('/image/encode',urlencodedParser,upload.single('file'),(req,res)=>{
    try {
    console.log(req.body.password+" "+req.body.message);
    console.log(nameoffile);
    let options = {
        mode : 'text',
        pythonOptions:['-u'],
        scriptPath:path.join(__dirname.replace('routes','uploads')),
        args:[nameoffile,'1',req.body.message,req.body.password]
    }
    PythonShell.run('imagefunctions.py',options,function(err,results){
        if(err)throw(err);
        console.log(results);
    })
    res.send(`http://localhost:3001/encimg/enc${nameoffile}`);
    } catch (error) {
        console.log(error);
    }
   
});

// Decoding Section 
router.post('/image/decode',urlencodedParser,upload.single('file'),(req,res)=>{
    console.log(req.body.password);
    console.log(nameoffile);
    let options = {
        mode : 'text',
        pythonOptions:['-u'],
        scriptPath:path.join(__dirname.replace('routes','uploads')),
        args:[nameoffile,'2','',req.body.password]
    }
    PythonShell.run('imagefunctions.py',options,function(err,results){
        if(err)throw err;
        console.log(results);
        res.send(results[0]);
    })
});

router.get('/encimg/:imgname',(req,res)=>{
    filename=req.params.imgname;
    console.log(filename)
    res.download(path.join(__dirname.replace('routes','uploads\\'))+filename,(error)=>{
        console.log(error);
    });
});

module.exports = router 