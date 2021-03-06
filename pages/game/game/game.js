// pages/game/game/game.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: "",
    showMatching: false,
    matchComing: false
  },

  redict: function (e) {
    var app = getApp();
    app.redict(e);

  },

  toggleShowMatching: function(){
    this.setData({
      showMatching: !this.data.showMatching
    });
  },
  // 比赛页
  goto_competition:function() {
    wx.navigateTo({
      url: '../competition/competitionindex'
    })
  },
  // 人机对战
  goto_ai_competition:function() {
    wx.navigateTo({
      url: '../aicompetition/aicompetition'
    })
  },
  // 线上匹配
  goto_fast_competition: function () {
    wx.navigateTo({
      url: '../fastcompetition/fastcompetition'
    })
  },
  // 好友对战
  goto_friends_competition:function() {
    wx.navigateTo({
      url: '../friendscompetition/friendscompetition'
    })
  },

  // 积分榜
  GoToScoreList: function(){
    wx.navigateTo({
      url: '../scorelist/scorelist',
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var serverRoot = getApp().globalData.ServerRoot;
    this.setData({ serverRoot: serverRoot });
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