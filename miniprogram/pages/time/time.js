// miniprogram/pages/mine/mine.js
var fn = require('../../fn');
const db = wx.cloud.database();
const todosCollection = db.collection('todolist');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    list:''
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onDayClick:function(e){
    var time = e.detail.id
    console.log(time)
    this.getListData(time)
  },
  //获取清单列表
  getListData:function(time){
    var _openid = app.globalData.openid;
    console.log(app.globalData)
    var time = time
    var _this = this
    todosCollection.where({
      _openid:_openid,
      time:time
    }).get().then(res => {
      console.log(res)
      _this.setData({
        list:res.data
      })
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData)
    // this.setData({
    //   headimg:app.globalData.userinfo.userInfo.avatarUrl
    // })
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