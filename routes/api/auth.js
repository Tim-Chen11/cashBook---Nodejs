var express = require('express');
var router = express.Router();
//导入jwt
const jwt = require('jsonwebtoken');
//读取配置项
const {secret} = require('../../config/config');
//导入用户模型
const UserModel = require('../../models/UserModel');
const md5 = require('md5');

//登陆操作
router.post('/login', (req, res)=>{
    //响应 html 内容
    // res.render('auth/login');

    //获取用户名和密码
    let{username, password} = req.body;
    //查询数据库
    UserModel.findOne({username: username, password: md5(password)})
    .then((data)=>{
        // console.log(data);
        // res.send('ceshi')
        if(!data){
            return res.json({
                code: '2002',
                msg: '用户或密码错误',
                data: null
            })
        }

        //创建当前用户的token
        let token = jwt.sign({
            username: data.username,
            _id: data._id
        }, secret, {
            expiresIn: 60 * 60 * 24 * 7
        });
        
        //响应 token
        res.json({
            code: '0000',
            msg: '登陆成功',
            data: token
        })

        //登陆成功响应
        res.render('success', {msg:'登陆成功', url:'/account'});
    })
    .catch((err)=>{
        res.json({
            code: '2001',
            msg: '数据库读取失败',
            data: null
        })
    })
})

//退出登录
router.post('/logout', (req, res)=>{
    //销毁session
    req.session.destroy(()=>{
        res.render('success', {msg: '推出成功', url: '/login'})
    })
})

module.exports = router;
