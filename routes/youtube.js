const express = require('express');
const Youtube = require('youtube-node');
const Video = require('../models/video');
const { verifyToken, apiLimiter } = require('./middlewares');


const router = express.Router();

const youtube = new Youtube();
//youtube.setKey('발급받은 API키 입력');
youtube.setKey(process.env.YOUTUBE_SECRET); // API 키 입력

/*
 youtubeRouter

 youtube api 요청 및 DB 등록
{
    "searchWord":"node",
    "limit":10
}
*/

router.route('/')
  .get(async (req, res, next) => {
    try {
      const video = await Video.findAll();
      res.render('video', { video });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });



router.post('/search/video',async (req,res,next) => {


  //// 검색 옵션 시작
  youtube.addParam('order', 'rating'); // 평점 순으로 정렬
  youtube.addParam('type', 'video');   // 타입 지정
  //// 검색 옵션 끝
  
  /*
    searchWord : 검색 단어
    limit : 가져올 갯수

    - limit 이 필요한 이유
    1) 하루에 youtube api 요청할 수 있는 API 가 한정돼있으므로 
    2) DB 대량 insert 시 부하 발생을 막기위한 용도
    */
    const { searchWord , limit  } = req.body;

    try {
        // 검색
        youtube.search(searchWord, limit, function (err, result) { 
            
          if(err) return res.status(400).send(err);
    
            // 결과 중 items 항목만 가져옴
            var items = result["items"];
            for (var i in items) { 

                var it = items[i];
                var title = it["snippet"]["title"];
                var description = it["snippet"]["description"];
                var id = it["id"]["videoId"];
                var url = "https://www.youtube.com/watch?v=" + id;
                var thumbnails = it["snippet"]["thumbnails"]["medium"]["url"];
                var channelId = it["snippet"]["channelId"]
                var channelTitle = it["snippet"]["channelTitle"]

                // updateOrCreate 로 바꿀 필요 있음
                // id 확인 후 있으면 저장 X / 없으면 저장 O 
                Video.create({
                    id,title,description,url,thumbnails,channelId,channelTitle
                });
            }
        });

        return res.status(200).json({success: true})
    } catch(err){
        console.error(err);
        return next(err);
    }

})

router.post('/search/channel',async (req,res,next) => {

  const { limit , channelId } = req.body;

//// 검색 옵션 시작
  youtube.addParam('type', 'video');   // 타입 지정
  youtube.addParam('fields', 'items(id(videoId),snippet(title,description,thumbnails,channelTitle))');   // 타입 지정
  youtube.addParam('channelId', channelId);
  youtube.addParam('part', 'id');
//// 검색 옵션 끝



    try {
        // 검색
        youtube.search(channelId, limit, function (err, result) { 
            
          if(err) return res.status(400).send(err);
    
            console.log(JSON.stringify(result, null, 2)); // 받아온 전체 리스트 출력
            // 결과 중 items 항목만 가져옴
            var items = result["items"];
            for (var i in items) { 

                var it = items[i];
                var title = it["snippet"]["title"];
                var description = it["snippet"]["description"];
                var id = it["id"]["videoId"];
                var url = "https://www.youtube.com/watch?v=" + id;
                var thumbnails = it["snippet"]["thumbnails"]["medium"]["url"];
                var channelTitle = it["snippet"]["channelTitle"]

                // updateOrCreate 로 바꿀 필요 있음
                // id 확인 후 있으면 저장 X / 없으면 저장 O 
                Video.create({
                    id:id,
                    title:title,
                    description:description,
                    url:url,
                    thumbnails:thumbnails,
                    channelId:channelId,
                    channelTitle: channelTitle
                });
            }
        });

        return res.status(200).json({success: true})
    } catch(err){
        console.error(err);
        return next(err);
    }

})


module.exports = router;




