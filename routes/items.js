const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const itemsModel = require('../models/item-model')
const verifytoken = require('../verifytoken')
//for routing setup
const router = express.Router();

router.post('/create',verifytoken,(req,res)=>{
  
    const form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files)=>{
        if(!err)
        {
            let ext = files.picture.originalFilename.split(".")[1].toLowerCase();
            if(ext==='png' || ext === 'jpeg' || ext==="jpg" || ext==="mp4")
            {

                let newFilePath = '/foodposts/'+files.picture.newFilename+'.'+ext;
                let newFilePathname = "http://localhost:8000/pics/"+files.picture.newFilename+'.'+ext;

                fs.readFile(files.picture.filepath,(err,fileContent)=>{
                    if(!err)    
                    {
                        fs.writeFile("./"+newFilePath,fileContent,(err)=>{

                            if(!err)
                            {
                                // fields['picture'] = [newFilePathname];
                                // if(ext === "mp4")
                                // {
                                //     fields["fileType"]="video"
                                // }

                                
                                itemsModel.create(fields)
                                .then((data)=>{
                                    res.send({message:"item Created successfully",success:true})
                                })
                                .catch((err)=>{
                                    console.log(err);
                                    res.send({message:"item was not created",success:false})
                                })
                            }
                        });
                    }
                });
            }
            else
            {
                res.send({message:"file not supported",success:false})
            }
        }
        else{

        }
    })

})

module.exports=router
