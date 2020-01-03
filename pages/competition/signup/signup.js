// pages/conpetition/signup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone:'',
    anonymity: false,
    ErrMsg: ""
  },

  ChangeAnonymity: function(e){
    this.setData({anonymity:e.detail.value});
  },

  Confirm: function(){
    if(this.data.name==''){
      this.setData({ErrMsg:"未输入姓名"});
      return
    }
  
    else if (!(/^\d+$/.test(this.data.phone)&&this.data.phone.length!=11)){
      this.setData({ErrMsg:"手机格式不正确"});
      return
    }

    else{
      this.setData({ErrMsg:''});
    }

    wx.showModal({
      title: '',
      content: '请先进行实名认证',
      confirmText: "立即实名",
      confirmColor: "#52A9FF",
      success(res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/orgmenu/orgmenu',
          })
        } else if (res.cancel) {

        }
      }
    })

    // wx.navigateTo({
    //   url: './signupok',
    // })
        


  },

  InputName: function(e){
    this.setData({name:e.detail.value});
  },
  InputPhone: function(e){
    this.setData({ phone: e.detail.value });
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