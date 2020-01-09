// pages/learn/learncontent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: "",
    shr:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMS4zMDEiIGhlaWdodD0iMTIuNDciIHZpZXdCb3g9IjAgMCAxMS4zMDEgMTIuNDciPg0KICA8cGF0aCBpZD0i5YiG5LqrIiBkPSJNMTE0LjgyLDc0LjAzMmExLjk0NSwxLjk0NSwwLDEsMS0uNC42NjZMMTExLDcyLjZhMi4zMzcsMi4zMzcsMCwxLDEsLjAwNi0zLjA3bDMuNDE4LTIuMDg2YTEuOTQ4LDEuOTQ4LDAsMSwxLC40MDkuNjY0TDExMS40MSw3MC4yYTIuMzQ3LDIuMzQ3LDAsMCwxLDAsMS43NDFabTAsMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwNi44OTkgLTY0LjgzMikiIGZpbGw9IiM4ODgiLz4NCjwvc3ZnPg0K' 
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