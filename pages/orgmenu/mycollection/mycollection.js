// pages/orgmenu/mycollections/mycollection.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: "",

    innerRoute: "competition",

    // 用户全部的对战收藏
    collections: [],

    // 当前选中的收藏
    currentCollection: null

  },

  GoToDetail: function (e) {
    let id = e.currentTarget.id;
    this.setData({ currentCollection: this.data.collections[id] });
    wx.navigateTo({
      url: '../competitiondetail/competitiondetail',
    })

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
    var that = this;
    // 获取用户本地缓存中的所有key
    wx.getStorageInfo({
      success(res) {
        let tempKeys = [];
        // 筛选对战的缓存
        for (let i = 0; i < res.keys.length; i++) {
          if (res.keys[i].length == 19) { // 是对战数据
            tempKeys.push(res.keys[i].toString());
          }
        }
        let tempCollections = {};
        for (let i = 0; i < tempKeys.length; i++) {
          wx.getStorage({
            key: tempKeys[i],
            success: function (res) {
              tempCollections[tempKeys[i]] = res.data;
              that.setData({ collections: tempCollections });
            },
            fail: function (res) {
            }
          });
        }
      }
    });
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