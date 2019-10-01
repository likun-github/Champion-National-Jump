// pages/chuangjian1/chuangjian1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['不限', '1000+', '2400+', ],
    objectArray: [
      {
        id: 0,
        name: '不限'
      },
      {
        id: 1,
        name: '1000+'
      },
      {
        id: 2,
        name: '2400+'
      },
      
    ],
    index: 0,
    array1: ['5分钟', '10分钟', '15分钟',],
    objectArray: [
      {
        id: 0,
        name: '5分钟'
      },
      {
        id: 1,
        name: '10分钟'
      },
      {
        id: 2,
        name: '15分钟'
      },

    ],
    index: 0,
    array2: ['2秒', '3秒', '5秒',],
    objectArray: [
      {
        id: 0,
        name: '2秒'
      },
      {
        id: 1,
        name: '3秒'
      },
      {
        id: 2,
        name: '5秒'
      },

    ],
    index: 0,
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

  },
  
  gotoqipan: function () {
    wx.showModal({
      title: '提示',
      content: '邀请好友',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (wx.navigateTo({

          url: '/pages/qipan1/qipan1',

        })) {
          console.log('用户点击取消')
        }
      }
    })
  }
})