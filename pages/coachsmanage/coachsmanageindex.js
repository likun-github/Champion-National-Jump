// pages/coachmanage/coachsmanageindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coachs: [
      { name: "邓维浩1", wechatId: "d39798984", signInCount: 3, choosen: true },
      { name: "邓维浩2", wechatId: "d39798984", signInCount: 3, choosen: false },
      { name: "邓维浩3", wechatId: "d39798984", signInCount: 3, choosen: true },
      { name: "邓维浩4", wechatId: "d39798984", signInCount: 3, choosen: false },
      { name: "邓维浩5", wechatId: "d39798984", signInCount: 3, choosen: false },
      { name: "邓维浩6", wechatId: "d39798984", signInCount: 3, choosen: true },
    ]

  },

// 导航

  goToAddCoach: function (){
    wx.navigateTo({
      url: '/pages/coachsmanage/addcoach',
    })

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