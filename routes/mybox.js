const express = require('express');
const router = express.Router();
const Mybox = require('../models/mybox');

/*
 mybox Router
*/

// 영상 보관함 목록 
router.get('/list',async (req,res,next) =>{ // GET /mybox/list
    try {
        const video = await Video.findAll();
       return  res.json(video);
    } catch (err){
        console.error(err);
        return res.status(400).send(err);
    }
})

// 영상 보관함 등록
router.post("/", async (req, res, next) => { // POST /mybox

try {
    const {videoId , title , description, thumbnails, channelId, url,userId} = req.body;

    Mybox.create({
        videoId:videoId,
        title:title,
        description:description,
        thumbnails:thumbnails,
        channelId:channelId,
        url:url,
        userId:userId
    });
    return res.status(200).send({success:true});
} catch (err){
    console.error(err);
    return next(err);
}

});



module.exports = router;