// pages/orgmenu/orgmenu.js
//获取应用实例
const app = getApp()

Page({
  data: {
    serverRoot: "",
    // 认证相关
    identification: 0, /*0：玩家；1：学生；2：教练；3：机构 */
    id_selected: 1, /*0：玩家；1：学生；2：教练；3：机构 */
    show_verification:false,

    // 动画相关
    hideModal: true,

    //授权
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false
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
      url: "/pages/orgmenu/mycollection/mycollection",
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
    this.setData({ hideModal: true });
    this.setData({ show_verification: false }); 
    switch(this.data.id_selected) {
      case 0: /* 玩家 */
        wx.navigateTo({
          url: '/pages/orgmenu/verification/person/person',
        });
        break;
      case 1: /* 学生 */
        wx.navigateTo({
          url: '/pages/orgmenu/verification/person/person',
        });
        break;
      case 2: /* 教练 */
        wx.navigateTo({
          url: '/pages/orgmenu/verification/person/person',
        });
        break;
      case 3: /* 机构 */
        wx.navigateTo({
          url: '/pages/orgmenu/verification/constitution/constitution',
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
   // 设置服务器路径
   var serverRoot = getApp().globalData.ServerRoot;
   this.setData({ serverRoot: serverRoot });

   var that = this;

   var app = getApp();

   that.setData({ gameInfo: app.globalData.gameInfo});


   var that = this;
   // 查看是否授权
   wx.getSetting({
     success: function (res) {
       if (res.authSetting['scope.userInfo']) {
         wx.getUserInfo({
           success: function (res) {
             // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
             // 根据自己的需求有其他操作再补充
             // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
             wx.login({
               success: res => {
                 // 获取到用户的 code 之后：res.code
                 console.log("用户的code:" + res.code);
                 // 可以传给后台，再经过解析获取用户的 openid
                 // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                 // wx.request({
                 //     // 自行补上自己的 APPID 和 SECRET
                 //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
                 //     success: res => {
                 //         // 获取到用户的 openid
                 //         console.log("用户的openid:" + res.data.openid);
                 //     }
                 // });
               }
             });
           }
         });
       } else {
         // 用户没有授权
         // 改变 isHide 的值，显示授权页面
         that.setData({
           isHide: true
         });
       }
     }
   });
   
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
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})

