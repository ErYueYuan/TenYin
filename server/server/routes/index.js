var express = require('express');
var router = express.Router();
var Mock =  require('mockjs');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
//   res.send(JSON.stringify(data))
// });
router.post('/getData',function (req,res,next){
  let  resutl  = {
    status:'success',
    datas:Mock.mock({
      'list|1-10':[
        {
          "id|+1":1,

        }
      ]
    }),
    msg:'查询成功'
  }
  res.send(resutl)
})
router.get('/getMusic',function (req,res){
   let result = {
     status:"success",
     data:Mock.mock({
        'musicList|10':[{
          'Content|1': ['角色精湛主题略荒诞', '理由太短 是让人不安', '疑信参半 却无比期盼', '你的惯犯 圆满', '别让纠缠 显得 孤单'],
          'name|1':['刘德华','张学友','朴树','王力宏','周杰伦'],
          'url|1':['http://121.196.46.103:8080/music/1.mp3']
        }]
     }
     ),
     msg:'查询歌曲成功'
   }
   res.json(result);
})
module.exports = router;
