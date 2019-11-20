// pages/chessmanual/chessmanualindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      innerRoute: "tree",
    sortMethod: "all"
  },

  redict: function (e) {
    var app = getApp();
    app.redict(e);

  },
  GoToDetail: function(){


    wx.navigateTo({
      url: '/pages/mycollection/competitiondetail',
    })
  },

  ChangeRoute: function (e) {

    this.setData({
      innerRoute: e.currentTarget.dataset.route
    })

  },
  GoToPractise: function(){
    wx.navigateTo({
      url: '/pages/mycollection/practise',
    })

  },

  changeSortMethod: function(e){

    var that = this;
    that.setData({sortMethod:e.currentTarget.dataset.method})
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