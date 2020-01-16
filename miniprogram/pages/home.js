// miniprogram/pages/home.js
var fn = require('../fn');
const db = wx.cloud.database();
const todosCollection = db.collection('todolist');
const openCollection = db.collection('open');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    active:1,
    time:'',
    inputvalue:'',
    list:'',
    listnull:false,
    open:'',
    listtest:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    }).catch(res=>{
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getData:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      active:index
    })
    console.log(index)
  },
  getTime:function(){
    var time = fn.getTime(new Date())
    this.setData({
      time:time
    })
    app.globalData.time = time
    this.getListData()
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
        app.globalData.openid = res.result.openid
        // _this.getUserInfo()
        this.getTime()
        console.log(app.globalData)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  //添加清单
  addList:function(e){
    var _this = this;
    var timedata = _this.data.time
    var value = e.detail.value;
    if(value == ''){
      wx.showToast({
        title: '内容不能为空',
        icon:'none'
      })
      return false
    }
    todosCollection.add({
      data:{
        time:timedata,
        text:value,
        done:false
      }
    })
    .then(res => {
      console.log(res)
      _this.getListData();
    })
    .catch(res => {
      wx.showModal({
        cancelColor: '创建失败',
      })
    })
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
      var isalldone = res.data.some(function(item){
        return item.done = false
      })
      if(!isalldone){
        _this.setData({
          listnull:true
        })
      }
      console.log(isalldone)
      console.log(_this.data)
    })
  },

  getUserInfo:function(){
    var _this = this;
    wx.getUserInfo({
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
      },
      fail:function(res){
        console.log('未授权',res)
        wx.navigateTo({
          url: './login/login',
        })
      }
    })
  },

  doneFn:function(e){
    var _this = this
    console.log('标记为完成');
    var text = e.currentTarget.dataset.text
    var _id = e.currentTarget.dataset.id
    console.log(_id)
    wx.showModal({
      title: '标记为完成',
      content: text,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'done',
            data: {
              id:_id,
              done:true
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

  //删除任务
  removeFn:function(e){
    var id = e.currentTarget.dataset.id
    var text = e.currentTarget.dataset.text
    var _this = this
    wx.showModal({
      title: '删除任务',
      content: text,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'remove',
            data: {
              id:id
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onGetOpenid();
    this.getOpen();
    var testarr
    var time = wx.getStorageSync('time');
    var timenow = fn.getTime(new Date())
    console.log(timenow)
    if(time == timenow){
      if(wx.getStorageSync('listtest')){
        testarr = wx.getStorageSync('listtest')
      }else{
        testarr = [
          {
            _id:'0',
            text:'坚持吃早饭',
            done:'false'
          },{
            _id:'1',
            text:'早起一杯水',
            done:'false'
          },{
            _id:'2',
            text:'跑步三公里',
            done:'false'
          },{
            _id:'3',
            text:'英文单词30个',
            done:'false'
          },{
            _id:'4',
            text:'自己做饭',
            done:'false'
          },{
            _id:'5',
            text:'一部电影',
            done:'false'
          }
        ]
      }
    }else{
      testarr = [
        {
          _id:'0',
          text:'坚持吃早饭',
          done:'false'
        },{
          _id:'1',
          text:'早起一杯水',
          done:'false'
        },{
          _id:'2',
          text:'跑步三公里',
          done:'false'
        },{
          _id:'3',
          text:'英文单词30个',
          done:'false'
        },{
          _id:'4',
          text:'自己做饭',
          done:'false'
        },{
          _id:'5',
          text:'一部电影',
          done:'false'
        }
      ]
      wx.setStorageSync('time', timenow)
    }
    
   
    
    this.setData({
      listtest:testarr
    })
    console.log(this.data)
  },

  doneFnTest:function(e){
    var id = e.currentTarget.dataset.id;
    var text = e.currentTarget.dataset.text;
    var _this = this
    var list = _this.data.listtest
    wx.showModal({
      title: '完成任务',
      content: text,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          list[id].done = 'true'
          _this.setData({
            listtest:list
          })
          wx.setStorageSync('listtest', list)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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