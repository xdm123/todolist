// miniprogram/pages/done/done.js
var fn = require('../../fn');
const db = wx.cloud.database();
const todosCollection = db.collection('todolist');
const openCollection = db.collection('open');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'',
    listtest:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onGetOpenid: function() {
    var _this = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        _this.setData({
          openid:res.result.openid
        })
        this.getTime()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  getTime:function(){
    var time = fn.getTime(new Date())
    this.setData({
      time:time
    })
    this.getListData()
  },

  //获取清单列表
  getListData:function(){
    var _openid = this.data.openid;
    var time = this.data.time
    var _this = this
    todosCollection.where({
      _openid:_openid,
      time:time
    }).get().then(res => {
      console.log(res)
      _this.setData({
        inputvalue:'',
        list:res.data
      })
      console.log(_this.data)
    })
  },


  //还原任务
  returnFn:function(e){
    var id = e.currentTarget.dataset.id
    var text = e.currentTarget.dataset.text
    var openid = e.currentTarget.dataset.openid
    var _this = this
    wx.showModal({
      title: '移至待办',
      content: text,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'back',
            data: {
              id:id,
              done:false,
              openid:openid
            },
            complete: res => {
              _this.getListData()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onGetOpenid();
    this.getOpen()
  },
  getOpen:function(){
    var _this = this;
    openCollection.where({
      id:'15501237985'
    }).get().then(res=>{
      console.log(res)
      _this.setData({
        open:res.data[0].open
      })
      if(res.data[0].open){
        var testarr = wx.getStorageSync('listtest')
        _this.setData({
          listtest:testarr
        })
        console.log(_this.data.listtest)
      }
    }).catch(res=>{
      console.log(res)
    })
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