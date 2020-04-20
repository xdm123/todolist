// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('dadsads',event.done)
  return new Promise((resolve, reject) => {
    console.log('dadsads',event)
    db.collection('userinfo').where({
      _openid:event._openid
    }).update({
      data:{
        score:event.score,
        userInfo:event.userdata
      }
    }).then(res=>{
      console.log('更新分数')
    })
  })
}