//导入express
const express = require('express');
//导入 moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
//声明中间件检测登录
let checkLoginMiddleware = require('../../middlewares/checkLoginMiddleware');
// //导入lowdb
// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')
// const adapter = new FileSync(__dirname + '/../data/db.json');
// //获取db对象
// const db = low(adapter);
// //导入 shortid
// const shortid = require('shortid');


//创建路由对象
const router = express.Router();

//测试
// console.log(moment('2023-02-24').toDate())
//格式化日期对象
// console.log(moment(new Date()).format('YYYY-MM-DD'));



//添加首页的路由规则
router.get('/', (req, res)=>{
  //重定向到account
  res.redirect('/account');
})

//记账本的列表
router.get('/account', checkLoginMiddleware, function(req, res, next) {
  //获取所有的账单信息
  // let accounts = db.get('accounts').value();
  // console.log(accounts);

  //callback doesn't work anymore, use promise
  // AccountModel.find().sort({time: -1}).exec((err, data) =>{
  //   if(err){
  //     res.status(500).send('读取失败~');
  //     return;
  //   }
  //   console.log(data);
  //   //响应成功的提示
  // res.render('list', {accounts: accounts});
  // })

  AccountModel.find().sort({time: -1}).exec()
  .then((data) => {
    //响应成功的提示
    res.render('list', {accounts: data, moment: moment});
  })
  .catch((err) => {
    res.status(500).send('读取失败~');
      return;
  });
});

//添加记录
router.get('/account/create', checkLoginMiddleware, function(req, res, next) {
  res.render('create');
});

//新增记录
router.post('/account', checkLoginMiddleware, (req, res) =>{
  //获取请求体的数据
  // console.log(req.body)

  // //生成id （使用lowdb）
  // let id = shortid.generate();
  // //写入文件
  // db.get('accounts').unshift({id:id, ...req.body}).write();

  //查看表单数据  问题是当把date传入数据库是类型不对，所以需要将string转换成date类型 2023-02-23 => new Date();
  //2023-02-24 => object(moment) => new Date();
  // console.log(req.body);

  //插入数据库, mogoose 6.0版本之后使用create()不再接受callback，需要用到promise
  // AccountModel.create({
  //   ...req.body,
  //   time: moment(req.body.time).toDate()
  // },(err, date) =>{
  //   if(err){
  //     res.status(500).send('插入失败~~');
  //     return;
  //   }
  //   //成功提醒
  //   res.render('success', {msg: '添加成功~', url:'/account'});
  // })

  //插入数据库 （promise）
  AccountModel.create({
    ...req.body,
    time: moment(req.body.time).toDate()
  })
  .then((data) => {
    //成功提醒
    res.render('success', { msg: '添加成功~', url: '/account' });
  })
  .catch((err) => {
    // Error handling
    console.log(err);
    res.status(500).send('插入失败~~');
  });

});

//删除记录
router.get('/account/:id', checkLoginMiddleware, (req, res)=>{
  //获取params的id参数
  let id = req.params.id;
  //删除
  // db.get('accounts').remove({id:id}).write();

  //删除
  AccountModel.deleteOne({_id: id})
  .then((data => {
    //提醒 
    res.render('success', {msg: '删除成功~', url:'/account'});
  }))
  .catch((err => {
    res.status(500).send('删除失败~~');
    return;
  }))
  
});

module.exports = router;
