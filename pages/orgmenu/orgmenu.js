// pages/orgmenu/orgmenu.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // 认证相关
    identification: 0, /*0：玩家；1：学生；2：教练；3：机构 */
    id_selected: 1, /*0：玩家；1：学生；2：教练；3：机构 */
    show_verification:false,

    // 动画相关
    hideModal: true,
  },

  redict: function(e){
    var app = getApp();
    app.redict(e);
  },

  // 选择认证身份
  selectIdentification:function(e) {
    var id = e.currentTarget.id;
    switch(id){
      case "student": 
        this.setData({ id_selected: 1 });
        break;
      case "coach":
        this.setData({ id_selected: 2 });
        break;
      case "constitution":
        this.setData({ id_selected: 3 });
        break;
      case "player":
        this.setData({ id_selected: 0 });
        break;
    }
      
  },

  // 前往 我的收藏
  goToCollection: function() {
    wx.navigateTo({
      url: '/pages/orgmenu/mycollections/mycollection',
    });
  },

  // 选择认证身份  
  chooseIdentification:function() {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    });
    this.animation = animation;
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200);
    this.setData({ show_verification:true});
    
  },

  // 前往身份认证
  goToVerification:function() {
    switch(this.data.id_selected) {
      case 0: /* 玩家 */
        wx.navigateTo({
          url: '/pages/orgmenu/verification/person',
        });
        break;
      case 1: /* 学生 */
        wx.navigateTo({
          url: '/pages/orgmenu/verification/person',
        });
        break;
      case 2: /* 教练 */
        wx.navigateTo({
          url: '/pages/orgmenu/verification/person',
        });
        break;
      case 3: /* 机构 */
        wx.navigateTo({
          url: '/pages/orgmenu/verification/constitution',
        });
        break;
    }    
  },

  cancelVerification:function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    });
    this.animation = animation;
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      });
    }, 720)//先执行下滑动画，再隐藏模块
    this.setData({ show_verification: false });
  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step();
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY("100%").step();
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
