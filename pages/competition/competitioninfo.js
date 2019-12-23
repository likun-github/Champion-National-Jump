// pages/conpetition/competitioninfo.js
Page({

  /**
   * 页面的初始数据
   */

//   CompetitionDesc: "ASDASD"
// CompetitionId: "0"
// CompetitionName: "AASDASD"
// CompetitionSignUpFinished: false
// CompetittionFinished: false
// ConstitutionId: "1"
// ConstitutionName: "云顶作坊"
// gx_md5_hash: "6FB7B5591BF06268C74A03327B73F16F"
  data: {
    serverRoot: "",
    competitionId: null,
    competition: null,
    signed: false
  },

  goToSignUp: function(){
    
    wx.navigateTo({
      url: './signup',
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置服务器路径
    var serverRoot = getApp().globalData.ServerRoot;
    this.setData({ serverRoot: serverRoot });

    var that = this;
    
    this.setData({
      competitionId: options.id
    });

    var app = getApp();

    var server = app.globalData.restServiceBaseUrl;


    wx.request({
      url: server+"/GetCompetitionInfo?id"+that.data.competitionId,
      success: function (res) {
        that.setData({ competition: res.data });
      }
    })


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