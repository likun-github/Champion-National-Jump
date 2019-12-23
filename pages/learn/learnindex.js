// pages/learn/learnindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: "",
    innerRoute: "begin",
    playVideo: false
  },
  redict: function (e) {
    var app = getApp();
    app.redict(e);

  },
  RuleDetail: function(){
    wx.navigateTo({
      url: './learncontent',
    })

  },
  returnToVideoList: function(){
    this.setData({ playVideo: false });

  },

  ChangeRoute: function(e){
    this.setData({
      innerRoute: e.currentTarget.dataset.route
    });

  },
  SeeVideo: function(){
    this.setData({playVideo: true});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置服务器路径
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