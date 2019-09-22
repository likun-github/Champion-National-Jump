// pages/jingcaibisai1_1/jingcaibisai1_1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['第一轮', '第二轮', '第三轮'],
    currentTab: 0


  },
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  swiperTab1: function (e) {
    var that = this;
    that.setData({
      currentTab1: e.detail.current
    });
  },
  clickTab1: function (e) {
    var that = this;
    if (this.data.currentTab1 === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab1: e.target.dataset.current
      })
    }
  },
  diyilun(e) {
    wx.showActionSheet({
      itemList: ['第一局', '第二局', '第三局'],
      itemColor: '#007aff',
      success(res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({

            url: '/pages/jingcaibisai2_1/jingcaibisai2_1',

          });
        } else if (res.tapIndex === 1) {
          wx.showToast({ title: '转发成功！' });
        } else if (res.tapIndex === 2) {
          wx.showToast({ title: '打印成功！' });
        }
      }
    })
  },
  gotorenwu1: function () {
    wx.navigateTo({

      url: '/pages/xiaoming1/xiaoming1',

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