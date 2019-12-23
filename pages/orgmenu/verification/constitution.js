// pages/orgmenu/verification/constitution.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: "",
    name:"",
    personInChargeName:"",
    personInChargePhone: "",
    images: [],
    error: 0, /*0：没有错误；1：未填写机构名；2：未填写负责人；3.未填写手机号；4：手机号格式不正确；5.未上传营业执照 */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置服务器路径
    var serverRoot = getApp().globalData.ServerRoot;
    this.setData({ serverRoot: serverRoot });
  },

  input:function(e) {
    switch(e.currentTarget.id) {
      case "name":
        this.setData({ name: e.detail.value });
        break;
      case "personInChargeName":
        this.setData({ personInChargeName: e.detail.value });
        break;
      case "personInChargePhone":
        this.setData({ personInChargePhone: e.detail.value });
        break;
    } 
  },


  // 开始填的时候把上面的红栏去掉啦
  changeError:function() {
    this.setData({ error: 0 });
  },

  // 选择营业凭证
  chooseImage:function() {
    var that=this;
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
  submit:function() {
    // 未上传营业执照
    if (this.data.images.length == 0) {
      this.setData({ error: 5 });
    } 

    // 手机号格式不正确
    if (this.data.personInChargePhone.length != 11) {
      this.setData({ error: 4 });
    } 

    // 未填写手机号
    if (this.data.personInChargePhone == "") {
      this.setData({ error: 3 });
    } 

    // 未填写负责人名字
    if (this.data.personInChargeName == "") {
      this.setData({ error: 2 });
    } 

    // 未填写机构名
    if (this.data.name=="") {
      this.setData({ error: 1 });
    } 

    // 没有错误，提交表格，并完成页面跳转
    if (this.data.error == 0) {
      wx.redirectTo({
        url: '/pages/orgmenu/verification/uploadsuccess',
      });
    }
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