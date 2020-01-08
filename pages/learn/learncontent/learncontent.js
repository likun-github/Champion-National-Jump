// pages/learn/learncontent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: "",
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
  onShareAppMessage: function (res) {

    var that = this;
    var goods_id = that.data.goods_id;//获取产品id
    var goods_title = that.data.goods_title;//获取产品标题
    var goods_img = that.data.goods_img;//产品图片
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '冠军国跳',
        path: '/pages/learn/learncontent/learncontent',
       // imageUrl: goods_img //不设置则默认为当前页面的截图
      }
    }
  }
})