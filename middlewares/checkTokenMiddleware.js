const jwt = require('jsonwebtoken')
//读取配置项
const {secret} = require('../config/config');
//声明中间件
module.exports = (req, res, next) => {
    //获取token
    let token = req.get('token');
    //判断
    if(!token){
      return res.json({
        code: '2003',
        msg: 'token 缺失',
        data: null
      })
    }
  
     //校验token
     jwt.verify(token, secret, (err, data) =>{
      //检测token是否正确
      if(err){
        return res.json({
          code: '2003',
          msg: 'token 校验失败',
          data: null
        })
      }
      //保存用户数据
      req.user = data;
      //如果token校验成功
      next();
    })
  
  }