var express = require('express');
var router = express.Router();
var Mock = require('mockjs');
var multer = require('multer');
var fs = require('fs');
var db = require('../mysql')
//使用os模块获取主机信息
const os = require('os');
var localhost="";
var network = os.networkInterfaces()
localhost = network[Object.keys(network)[0]][0].address
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
//   res.send(JSON.stringify(data))
// });
//单文件上传,使用multer上传模块  dest文件保存根目录，file返回属性对象    单文件上传
router.post('/upload', multer({
  dest: 'public/images'
}).single('file'), function (req, res) {
  //返回的一个随机码的文件名，通过fs模块  更改路径renameSync(原路径,新路径)
  console.log(req.file);
  fs.renameSync(req.file.path, `public/images/${req.file.originalname}`)
  let post = [
    req.file.fieldname,
    'ceshi', 
    `http://${localhost}/public/images/${req.file.originalname}`
  ]
  const query = 'INSERT INTO music_db.music(name,m_name,url) VALUES(?,?,?)';
  db.query(query, post, (err, result) => {
    if (err) {
      console.log(1);
    } else {
      console.log(2);
      res.send(req.file)
    }
  })
})
//多传
router.post('/arrUpload',multer({
  dest: 'upload'
}).array('logo',5),function(req,res){
  console.log(res);
  console.log(req.logo);
})
//查看静态资源
router.post('/upload/:filename',function(req,res,next){
   const name = req.params.filename;
   const path = `/upload/${name}`;
   
})
router.post('/getData', function (req, res, next) {
  let resutl = {
    status: 'success',
    datas: Mock.mock({
      'list|1-10': [{
        "id|+1": 1,

      }]
    }),
    msg: '查询成功'
  }
  res.send(resutl)
})
router.get('/getMusic', function (req, res) {
  let result = {
    status: "success",
    data: Mock.mock({
      'musicList|10': [{
        'Content|1': ['角色精湛主题略荒诞', '理由太短 是让人不安', '疑信参半 却无比期盼', '你的惯犯 圆满', '别让纠缠 显得 孤单'],
        'name|1': ['刘德华', '张学友', '朴树', '王力宏', '周杰伦'],
        'url|1': ['http://121.196.46.103:80/music/1.mp3']
      }]
    }),
    msg: '查询歌曲成功'
  }
  res.json(result);
})
module.exports = router;