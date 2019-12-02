// pages/chessmanual/chessmanualindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      scroll_view_height: (wx.getSystemInfoSync().windowHeight * (750 / wx.getSystemInfoSync().windowWidth) - 120),
      background_height_rpx:750/1024*2668,
      pass_pos_info:[
        { height_ratio: 0.04, width_ratio: 0.44, isTen: 1, state: 0, tag_height_ratio:0.105 ,tag_width_ratio:0.41},
        { height_ratio: 0.10, width_ratio: 0.11, isTen: 0, state: 0, tag_height_ratio: 0.175, tag_width_ratio: 0.09 },
        { height_ratio: 0.25, width_ratio: 0.34, isTen: 0, state: 0, tag_height_ratio: 0.27, tag_width_ratio: 0.48 },
        { height_ratio: 0.32, width_ratio: 0.65, isTen: 0, state: 0, tag_height_ratio: 0.35, tag_width_ratio: 0.48 },
        { height_ratio: 0.41, width_ratio: 0.71, isTen: 0, state: 0, tag_height_ratio: 0.44, tag_width_ratio: 0.53 },
        { height_ratio: 0.53, width_ratio: 0.84, isTen: 0, state: 0, tag_height_ratio: 0.54, tag_width_ratio: 0.70 },
        { height_ratio: 0.54, width_ratio: 0.49, isTen: 0, state: 0, tag_height_ratio: 0.615, tag_width_ratio: 0.46 },
        { height_ratio: 0.61, width_ratio: 0.15, isTen: 0, state: 0, tag_height_ratio: 0.685, tag_width_ratio: 0.13 },
        { height_ratio: 0.69, width_ratio: 0.59, isTen: 0, state: 1, tag_height_ratio: 0.715, tag_width_ratio: 0.715 },
        { height_ratio: 0.82, width_ratio: 0.20, isTen: 0, state: 2, tag_height_ratio: 0.855, tag_width_ratio: 0.35 }
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