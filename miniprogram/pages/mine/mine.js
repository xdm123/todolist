// miniprogram/pages/mine/mine.js
var app = getApp()
const db = wx.cloud.database();
const todosCollection = db.collection('todolist');
const userinfoCollection = db.collection('userinfo');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login:false,
    userInfo:'',
    total:'',
    successNum:'',
    failNum:'',
    star:[0,0,0,0,0,0,0,0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //获取清单列表
  getListData:function(){
    var _openid = app.globalData.openid;
    var _this = this
    todosCollection.where({
      _openid:_openid
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
      var star = Math.floor(successNum / total * 10);
      if(total == 0){
        var score = 0;
      }else{
        var score = (successNum/total).toFixed(2);
      }
      var stararr = [0,0,0,0,0,0,0,0,0,0]
      for(var i = 0 ; i < star ; i ++){
        stararr[i] = 1
      }
      console.log(stararr)
      _this.setData({
        total:total,
        successNum:successNum,
        failNum:failNum,
        star:stararr,
        score:score
      })
      this.createUser(score)
    })
  },

  createUser:function(score){
    console.log('创建用户或更新用户评分');
    var _openid = app.globalData.openid;

    userinfoCollection.where({
      _openid:_openid
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
        console.log(_openid,score)
        wx.cloud.callFunction({
          name: 'refreshScore',
          data: {
            _openid:_openid,
            score:score,
            userdata:app.globalData.userinfo
          },
          complete: res => {
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getUserInfo:function(){
    var _this = this;
    wx.getUserInfo({
      lang:'zh_CN',
      success: function(res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        console.log(res)
        app.globalData.userinfo = res
        _this.setData({
          login:true,
          userInfo:res
        })
        _this.getListData()
      },
      fail:function(){
        _this.setData({
          login:false,
          userInfo:res
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})