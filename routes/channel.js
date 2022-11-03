const express = require('express');
const router = express.Router();
const Video = require('../models/video');

// 내 동영상 목록 (유투버 전용)
router.get('/list', (req, res) => { // GET /channel/list
    Video.findAll({ where: { channelId: req.body.channelId } })
      .then((video) => {
        res.json(video);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({message: '서버 에러',});
      });
  });


  module.exports = router;