// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('dadsads',event)
  return new Promise((resolve, reject) => {
    console.log('dadsads',event)
    db.collection('todolist').where({
      _id:event.id
    }).update({
      data:{
        done:event.done
      }
    }).then(res=>{
      console.log('更新成功')
    })
  })
  
}