// pages/userIdentifyForm/userIdentifyForm.js
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    role: "student",

    hideModal: true,

    openId: null,

    constitutions:[{name:"PANGAPING"},{name:"PAGE"},{name:"BREATH"}],
    // form data

    formData:{
      trueName: null,
      idNumber: null,
      teleNumber: null,
      address: null,
      constitutionId: null,
      idCardImage: null,
      levelCertificate: null,
      constitutionName: null,
      managerName: null,
      businessLicense: null,
      role:null,
      openId: null

    }

    },

  GetConstitutions:function(){
    var that = this;

    // var app = getApp();

    // var restService = app.globalData.restServiceBaseUrl;

    // wx.request({
    //   url: restService + "GetConstitutions",
    //   data:{},
    //   method: "POST",
    //   success: (res)=>{
    //     that.setData({constitutions:res.data});
    //   }

    // })

    that.setData({constitutions: ["PANGAPING","asss"]})

  },
  


  DoRegiste: function(){
    var that = this;


    var app = getApp();


    var url;

    if(that.role=="student"){

      url = "DoRegisterStudent"

    }
    else if(that.role="constitution"){
      url = "DoRegisterConstitution"
    }
    else{
      url = "DoRegisterTutor"

    }



  

    var restService = app.globalData.restServiceBaseUrl;

    // address: null,
    // constitutionId: null,
    // idCardImage: null,
    // levelCertificate: null,
    // constitutionName: null,
    // leaderName: null,
    // businessLicense: null,





    wx.request({
      url: restService + url,
      method: "POST",
      data: JSON.stringify(that.data.formData),
      success: function(res){
          console.log(res.data)
        },
      fail: function(){


      }
    });

    
    
    

  },

  constitutionNameInput: function(e){
    this.data.formData.constitutionName = e.detail.value;
  },

  leaderNameInput: function(e){
    this.data.formData.managerName = e.detail.value;
  },
  tureNameInput: function(e){
    this.data.formData.trueName = e.detail.value;
  },
  idNumverInput: function(e){
    this.data.formData.idNumber = e.detail.value;
  },
  teleNumberInput: function(e){

    this.data.formData.teleNumber = e.detail.value;
  },
  addressInput: function(e){

    this.data.formData.address = e.detail.value;
  },




  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 720)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  uploadImage(e){
    let that = this;
    let timestamp = (new Date()).valueOf();

    var fieldName = e.currentTarget.dataset.fieldName;

    wx.chooseImage({
      success: chooseResult => {

        this.data.formData[fieldName] = chooseResult.tempFilePaths[0];

      },
    })

    

    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var app = getApp();


    this.data.formData.role = options.role;
    console.log(app.globalData)
    // this.data.formData.openId = app.globalData.openId;
    this.setData({ openId: app.globalData.openId,role: options.role});

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