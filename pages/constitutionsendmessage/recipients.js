// pages/recipients/recipients.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 控制列出学生还是列出班级
    
    innerRoute: "classes",

    students:[
      {name:"邓维浩",wechatId:"d39798984",signInCount:3,choosen:true},
      { name: "邓维浩", wechatId: "d39798984", signInCount: 3, choosen: false },
      { name: "邓维浩", wechatId: "d39798984", signInCount: 3, choosen: true },
      { name: "邓维浩", wechatId: "d39798984", signInCount: 3, choosen: false },
      { name: "邓维浩", wechatId: "d39798984", signInCount: 3, choosen: false },
      { name: "邓维浩", wechatId: "d39798984", signInCount: 3, choosen: true },
      ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  ChangeRoute: function(e){
    this.setData({innerRoute: e.currentTarget.dataset.route});

  },


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