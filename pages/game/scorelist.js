// pages/game/scorelist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreList:[],
    scrollViewHeight: (wx.getSystemInfoSync().windowHeight * (750 / wx.getSystemInfoSync().windowWidth) - 87),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getScoreList();
  },

  // 获取积分榜
  getScoreList: function () {
    this.setData({ scoreList:
    [
      { "index": 1, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 2, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 3, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 4, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 5, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 6, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 7, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 8, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 9, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 10, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
      { "index": 0, "name": "Yun Ding", "score": 8000, "title": "八级棋手" },
    ]
    
    });
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