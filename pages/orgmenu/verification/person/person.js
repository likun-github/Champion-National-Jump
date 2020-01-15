// pages/orgmenu/verification/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: "",
    constitution: "",
    images: [],
    name: "",
    idNumber: "",
    error: 0, /*0：没有错误；1：未填写机构名；2：未上传身份证件；3.未填写姓名；4：未填写证件号码；*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置服务器路径
    var serverRoot = getApp().globalData.ServerRoot;
    this.setData({ serverRoot: serverRoot });
  },
  Uploadinfo() {



    wx.request({
      url: '',
    })

  },
  IdNumberChange(e) {
    this.setData({ IdNumber: e.detail.value });
  },

  // 输入信息
  input: function (e) {
    switch (e.currentTarget.id) {
      case "constitution":
        this.setData({ constitution: e.detail.value });
        break;
      case "name":
        this.setData({ name: e.detail.value });
        break;
      case "idNumber":
        this.setData({ idNumber: e.detail.value });
        break;
    }
  },

  // 选择身份证件
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = that.data.images.concat(res.tempFilePaths);
        // 限制最多只能留下3张照片
        that.data.images = images.length <= 1 ? images : images.slice(0, 1);
      }
    });
  },

  // 提交信息
  submit: function () {
    // 未填写证件号码
    if (this.data.idNumber == "") {
      this.setData({ error: 4 });
    }

    // 未填写姓名
    if (this.data.name == "") {
      this.setData({ error: 3 });
    }

    // 未上传身份证件
    if (this.data.images.length == 0) {
      this.setData({ error: 2 });
    }

    // 未填写机构名
    if (this.data.constitution == "") {
      this.setData({ error: 1 });
    }

    // 没有错误，提交表格，并完成页面跳转
    if (this.data.error == 0) {
      wx.redirectTo({
        url: "/pages/orgmenu/verification/uploadsuccess/uploadsuccess",
      });
    }
  },

  // 开始填的时候把上面的红栏去掉啦
  changeError: function () {
    this.setData({ error: 0 });
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