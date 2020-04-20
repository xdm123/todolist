// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('dadsads',event.done)
  return new Promise((resolve, reject) => {
    console.log('dadsads',event)
    db.collection('todolist').where({
      _id:event.id
    }).update({
      data:{
        done:event.done
      }
    }).then(res=>{
      console.log('移动至待办')


      
      db.collection('todolist').where({
        _openid:event.openid
      }).get().then(res => {
        console.log(res);
        var total = res.data.length; //历史总任务数
        var successNum = 0; //完成数
        var failNum = 0; //未完成数
        res.data.map(function(item){
          if(item.done){
            successNum += 1
          }else{
            failNum += 1
          }
        })
        
        if(total == 0){
          var score = 0;
        }else{
          var score = (successNum/total).toFixed(2);
        }


        console.log('dadsad',event.id)
        db.collection('userinfo').where({
          _openid:event.openid
        }).get().then(res => {
          console.log('获取用户信息',res);
          if(res.data.length == 0){
            console.log('需要创建');
            userinfoCollection.add({
              data:{
                userInfo:app.globalData.userinfo,
                score:score
              }
            }).then(res=>{
              console.log('success')
            })
          }else{
            console.log('更新用户评分数据');
            db.collection('userinfo').where({
              _openid:event.openid
            }).update({
              data:{
                score:score
              }
            }).then(res=>{
              console.log('更新分数')
            })
          }
        })
        
      })


    })
  })
}