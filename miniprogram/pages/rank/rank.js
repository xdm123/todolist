// miniprogram/pages/rank/rank.js
var app = getApp()
const db = wx.cloud.database();
const todosCollection = db.collection('todolist');
const userinfoCollection = db.collection('userinfo');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getlist()
  },
  getlist:function(){
    userinfoCollection.get().then(res => {
      console.log(res);
      var list = res.data
      function compare(property){
        return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value2 - value1;
        }
      }
      list.sort(compare('score'))
      console.log(list)
      list.map(function(item){
        item.score = Math.floor(item.score * 100) + '%'
      })
      this.setData({
        list:list
      })
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