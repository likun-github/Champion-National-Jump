// pages/orgmenu/orgmenu.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    blue: '../../statics/blue.png',
    identityimg: '../../statics/1.png',
    classimg: '../../statics/2.png',
    coachimg: '../../statics/3.png',
    studentimg: '../../statics/4.png',
    messageimg: '../../statics/5.png',
    gameimg: '../../statics/6.png',
    org: '../../statics/org.png',
    orgimg:'../../statics/orgimg.png',
    hideModal: true, //模态框的状态  true-隐藏  false-显示

    animationData: {},//

    roles: ["student","constitution","coach"],

    registedInfo:{
      role: "student",
      authenticated: true
    }
  },

  redict: function(e){
    var app = getApp();
    app.redict(e);

  },

  //事件处理函数
  GoToCollection: function(){
    wx.navigateTo({
      url: '/pages/mycollection/mycollection',
    });
    

  },

  goToHoldCompetition: function(){
    wx.navigateTo({
      url: '../holdcompetition/holdcompetition',
    })
  },

  goToStudentsManage: function(){
  },

goToCoachsManage: function () {
    wx.navigateTo({
      url: '/pages/coachsmanage/coachsmanageindex',
    })
  },

goToStudentsManage: function(){
  wx.navigateTo({
    url: '/pages/studentsmanage/studentsmanageindex',
  })
},

goToMessages: function(){
  wx.navigateTo({
    url: '/pages/constitutionsendmessage/contitutionmessage',
  })

},

/***************到班级管理******************* */
go2classmanage:function(){
  wx.navigateTo({
    url: '../classmanage/classmanage'
  })

},

/***********到用户认证表单************/
goToIdentifyForm: function(e){
  wx.navigateTo({
    url: '../userIdentifyForm/userIdentifyForm' + "?role="+e.currentTarget.dataset.role
  })
},


  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },



  /***************身份认证***************/


  //用户点击“用户认证”弹出选择认证角色



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


 onLoad: function () {
   var that = this;

   var app = getApp();

   that.setData({ gameInfo: app.globalData.gameInfo});



   
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})
