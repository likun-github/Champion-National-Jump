// pages/chessmanual/chessmanualindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      scroll_view_height: (wx.getSystemInfoSync().windowHeight * (750 / wx.getSystemInfoSync().windowWidth) - 120),
      background_height_rpx:750/1024*2668,
      pass_pos_info:[
        { height_ratio: 0.05, width_ratio: 0.444, isTen: 1, state: 0 },
        { height_ratio: 0.11, width_ratio: 0.11, isTen: 0, state: 0 },
        { height_ratio: 0.27, width_ratio: 0.35, isTen: 0, state: 0 },
        { height_ratio: 0.34, width_ratio: 0.69, isTen: 0, state: 0 },
        { height_ratio: 0.44, width_ratio: 0.74, isTen: 0, state: 0 },
        { height_ratio: 0.55, width_ratio: 0.86, isTen: 0, state: 0 },
        { height_ratio: 0.56, width_ratio: 0.51, isTen: 0, state: 0 },
        { height_ratio: 0.64, width_ratio: 0.18, isTen: 0, state: 0 },
        { height_ratio: 0.71, width_ratio: 0.62, isTen: 0, state: 0 },
        { height_ratio: 0.84, width_ratio: 0.23, isTen: 0, state: 0 }
        ],
      currentPass:"pass-9",
  },

  redict: function (e) {
    var app = getApp();
    app.redict(e);

  },

  goToPass:function(e) {
    console.log(e.currentTarget);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onPullDownRefresh: function () {
    var that = this;

    if (that.innerRoute == "train"){
      that.setData("practicePageIndex", ++that.practicePageIndex);
      that.getPractices();
    }
    else if(that.innerRoute == "competition")
    {
      that.setData("practicePageIndex", ++that.competitionPageIndex);
      that.getCompetitions();
    }

    
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