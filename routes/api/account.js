const express = require('express');
const jwt = require('jsonwebtoken');
//声明中间件
const checkTokenMiddleware = require('../../middlewares/checkTokenMiddleware');
// //导入lowdb
// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')
// const adapter = new FileSync(__dirname + '/../data/db.json');
// //获取db对象
// const db = low(adapter);
// //导入 shortid
// const shortid = require('shortid');
//导入 moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

const router = express.Router();


//测试
// console.log(moment('2023-02-24').toDate())
//格式化日期对象
// console.log(moment(new Date()).format('YYYY-MM-DD'));

//记账本的列表
router.get('/account', checkTokenMiddleware, function(req, res, next) {
  console.log(req.user);
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
    res.json({
        //响应编号
        code: '0000',
        //响应的信息
        msg: '读取成功',
        //响应的数据
        data: data
    })
  })
  .catch((err) => {
    res.json({
        code: '1001',
        msg: ' 读取失败~~',
        data: null
    })
  });
});

// //添加记录
// router.get('/account/create', function(req, res, next) {
//   res.render('create');
// });

//新增记录
router.post('/account', checkTokenMiddleware, (req, res) =>{
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

  //表单验证(自己上网搜写写看)
  
  //插入数据库 （promise）
  AccountModel.create({
    ...req.body,
    time: moment(req.body.time).toDate()
  })
  .then((data) => {
    //成功提醒
    res.json({
        code: '0000',
        msg: ' 创建成功',
        data: data
    })
  })
  .catch((err) => {
    // Error handling
    res.json({
        code: '1002',
        msg: '创建失败',
        data: null
    })
  });
});

//删除记录
router.delete('/account/:id', checkTokenMiddleware, (req, res)=>{
  //获取params的id参数
  let id = req.params.id;
  //删除
  // db.get('accounts').remove({id:id}).write();

  //删除
  AccountModel.deleteOne({_id: id})
  .then((data => {
    //提醒 
    // res.render('success', {msg: '删除成功~', url:'/account'});
    res.json({
        code: '0000',
        msg: ' 删除成功',
        data: {}
    })
  }))
  .catch((err => {
    res.json({
        code: '1003',
        msg: '删除账单失败',
        data: null
    })
  }))
  
});

//获取单个账单信息
router.get('/account/:id', checkTokenMiddleware, (req, res) => {
    //获取id参数
    let {id} = req.params;
    //查询数据库
    AccountModel.findById(id)
    .then((data) =>{
        res.json({
            code: '0000',
            msg: '读取成功',
            data: data
        })
    })
    .catch((err) =>{
        res.json({
            code: '1004',
            msg: '读取失败',
            data: null
        })
    })
})

//更新单个的路由信息
router.patch('/account/:id', checkTokenMiddleware, (req, res)=>{
    //获取id参数值
    let {id} = req.params;
    //更新数据库
    AccountModel.updateOne({_id: id}, req.body)
    .then((data) =>{
        //再次查询数据库 获取单条数据
        AccountModel.findById(id)
        .then((data) =>{
            res.json({
                code: '0000',
                msg: '更新成功',
                data: data
            })
        })
        .catch((err) =>{
            res.json({
                code: '1004',
                msg: '读取失败',
                data: null
            })
        })
    })
    .catch((err) =>{
        res.json({
            code: '1005',
            msg: '更新失败',
            data: null
        })
    })
})

module.exports = router;

