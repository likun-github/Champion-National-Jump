// pages/mycollection/mycollection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    innerRoute: "competition",
    collections:[]
  },

  GoToDetail: function () {
    wx.navigateTo({
      url: './competitiondetail',
    })

  },

  ChangeRoute: function(e){ 
    this.setData({
      innerRoute: e.currentTarget.dataset.route
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
    var that = this;
    // 获取用户本地缓存中的所有key
    wx.getStorageInfo({
      success(res) {
        console.log(res.keys);
        let tempKeys = [];
        // 筛选对战的缓存
        for (let i=0; i<res.keys.length; i++) {
          if(res.keys[i].length == 19) { // 是对战数据
            tempKeys.push(res.keys[i].toString());
          }
        }
        let tempCollections = [];
        
        for (let i = 0; i < tempKeys.length; i++) {          
          wx.getStorage({
            key: tempKeys[i],          
            success: function (res) {
              let tempCollection = {};
              tempCollection["id"] = tempKeys[i];
              tempCollection["type"] = res.data["type"];
              tempCollection["white"] = res.data["white"];
              tempCollection["black"] = res.data["black"];
              tempCollections.push(tempCollection);
              that.setData({ collections: tempCollections });
              console.log(res.data);
            },
            fail: function (res) {
              console.log(res);
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