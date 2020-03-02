// pages/orgmenu/orgmenu.js
//获取应用实例
const app = getApp()
import tool from "../../../utils/tool.js";
Page({
  data: {
    c:true,
    userpho:"",
    username:'',
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
    isHide: false,
    
    ge:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNzUiIGhlaWdodD0iMTUyLjAwMSIgdmlld0JveD0iMCAwIDM3NSAxNTIuMDAxIj4KICA8cGF0aCBpZD0i5Liq5Lq65L+h5oGv5LiL6Z2i55qE6JOd6Imy5bqVIiBkPSJNNTgzNy41LDczODljLTY3LjA0NiwwLTEzMS44ODMtNS43ODctMTg3LjUtMTYuNzM0VjcyMzdoMzc1djEzNS4yNjdDNTk2OS4zODIsNzM4My4yMTQsNTkwNC41NDYsNzM4OSw1ODM3LjUsNzM4OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01NjUwIC03MjM3KSIgZmlsbD0iIzRjODdmZCIvPgo8L3N2Zz4K',
    goushangbai:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgdmlld0JveD0iMCAwIDE3IDE3Ij4KICA8ZyBpZD0i57uEXzEyNjkiIGRhdGEtbmFtZT0i57uEIDEyNjkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI3MjAgNTM2MikiPgogICAgPHJlY3QgaWQ9IuefqeW9ol82MzIiIGRhdGEtbmFtZT0i55+p5b2iIDYzMiIgd2lkdGg9IjE3IiBoZWlnaHQ9IjE3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjcyMCAtNTM2MikiIGZpbGw9Im5vbmUiLz4KICAgIDxnIGlkPSJJY29uc19PdXRsaW5lZF9kb25lIiBkYXRhLW5hbWU9Ikljb25zL091dGxpbmVkL2RvbmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNzIwIC01MzU5KSI+CiAgICAgIDxnIGlkPSJJY29uc19UaW50X0NvbG9yX0JsYWNrIiBkYXRhLW5hbWU9Ikljb25zL1RpbnQgQ29sb3IvQmxhY2siPgogICAgICAgIDxwYXRoIGlkPSLlm77moIfpopzoibIiIGQ9Ik01Ljc3NCwxMC4yNjQuOTYyLDUuNDUzLDAsNi40MTVsNS4xMzIsNS4xMzJhLjkwNy45MDcsMCwwLDAsMS4yODMsMEwxNywuOTYyLDE2LjAzOCwwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSIgZmlsbD0iIzUyYTlmZiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K',
    goubai:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgdmlld0JveD0iMCAwIDE3IDE3Ij4KICA8cmVjdCBpZD0i55+p5b2iXzYzMiIgZGF0YS1uYW1lPSLnn6nlvaIgNjMyIiB3aWR0aD0iMTciIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==',
    cha:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMS43NyIgaGVpZ2h0PSIyMS43NyIgdmlld0JveD0iMCAwIDIxLjc3IDIxLjc3Ij4KICA8cmVjdCBpZD0i55+p5b2iXzYzMyIgZGF0YS1uYW1lPSLnn6nlvaIgNjMzIiB3aWR0aD0iMjEuNzciIGhlaWdodD0iMjEuNzciIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==',
    x:'data:image/svg+xml;base64,PHN2ZyBpZD0iSWNvbnNfVGludF9Db2xvcl9CbGFjayIgZGF0YS1uYW1lPSJJY29ucy9UaW50IENvbG9yL0JsYWNrIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTMuMTU1IiBoZWlnaHQ9IjEzLjE1NSIgdmlld0JveD0iMCAwIDEzLjE1NSAxMy4xNTUiPgogIDxkZWZzPgogICAgPGNsaXBQYXRoIGlkPSJjbGlwLXBhdGgiPgogICAgICA8cGF0aCBpZD0i5Zu+5qCH6aKc6ImyIiBkPSJNNi41NzcsNS42MTkuOTU5LDAsMCwuOTU5LDUuNjE5LDYuNTc3LDAsMTIuMmwuOTU5Ljk1OUw2LjU3Nyw3LjUzNiwxMi4yLDEzLjE1NWwuOTU5LS45NTlMNy41MzYsNi41NzcsMTMuMTU1Ljk1OSwxMi4yLDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIiBmaWxsPSJyZ2JhKDAsMCwwLDAuOSkiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxwYXRoIGlkPSLlm77moIfpopzoibItMiIgZGF0YS1uYW1lPSLlm77moIfpopzoibIiIGQ9Ik02LjU3Nyw1LjYxOS45NTksMCwwLC45NTksNS42MTksNi41NzcsMCwxMi4ybC45NTkuOTU5TDYuNTc3LDcuNTM2LDEyLjIsMTMuMTU1bC45NTktLjk1OUw3LjUzNiw2LjU3NywxMy4xNTUuOTU5LDEyLjIsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMCkiIGZpbGw9InJnYmEoMCwwLDAsMC45KSIvPgo8L3N2Zz4K',
    hui:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNSIgdmlld0JveD0iMCAwIDI1IDI1Ij4KICA8ZyBpZD0i54Gw6ImyaW5mbyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM2IC00MDIpIj4KICAgIDxjaXJjbGUgaWQ9IueBsOiJsueahGluZm8iIGN4PSIxMi41IiBjeT0iMTIuNSIgcj0iMTIuNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzYgNDAyKSIgZmlsbD0iI2VhZWFlYSIvPgogICAgPHRleHQgaWQ9ImkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ3IDQxOSkiIGZpbGw9IiNmZmYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSJTb3VyY2VIYW5TYW5zQ04tSGVhdnksIFNvdXJjZSBIYW4gU2FucyBDTiIgZm9udC13ZWlnaHQ9IjgwMCIgbGV0dGVyLXNwYWNpbmc9IjAuMDE0ZW0iPjx0c3BhbiB4PSIwIiB5PSIwIj5pPC90c3Bhbj48L3RleHQ+CiAgPC9nPgo8L3N2Zz4K',
    co:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIyMi41MDQiIHZpZXdCb3g9IjAgMCAyNSAyMi41MDQiPgogIDxwYXRoIGlkPSLmlLbol4/lpLkiIGQ9Ik0xMTAuNDU1LDEzMS41NDhIMTAxLjlhMi4zNTIsMi4zNTIsMCwwLDEtMi4wNTgtMS4yMThsLS42MjYtMS4xMzJhMi4zNTIsMi4zNTIsMCwwLDAtMi4wNTgtMS4yMThoLTdhMi4zNjEsMi4zNjEsMCwwLDAtMi4zNTUsMi4zNjh2MTcuNzY5YTIuMzYxLDIuMzYxLDAsMCwwLDIuMzU1LDIuMzY4aDIwLjI5MWEyLjM2MSwyLjM2MSwwLDAsMCwyLjM1NS0yLjM2OHYtMTQuMkEyLjM2MiwyLjM2MiwwLDAsMCwxMTAuNDU1LDEzMS41NDhabS01LjM1OSw4LjU3MS0xLjg4NSwxLjg0OGEuMzU4LjM1OCwwLDAsMC0uMS4zMTVsLjQ0NSwyLjYxYS41MTYuNTE2LDAsMCwxLS4yMDUuNTA3LjUwOS41MDksMCwwLDEtLjU0My4wMzlsLTIuMzMxLTEuMjMyYS4zNTMuMzUzLDAsMCwwLS4zMjksMGwtMi4zMzEsMS4yMzJhLjUxNi41MTYsMCwwLDEtLjc0OC0uNTQ2bC40NDUtMi42MWEuMzU3LjM1NywwLDAsMC0uMS0uMzE1bC0xLjg4NS0xLjg0OGEuNTE5LjUxOSwwLDAsMSwuMjg2LS44ODRsMi42MDYtLjM4MWEuMzU0LjM1NCwwLDAsMCwuMjY3LS4xOTVsMS4xNjYtMi4zNzRhLjUxNC41MTQsMCwwLDEsLjkyNCwwbDEuMTY1LDIuMzc0YS4zNTQuMzU0LDAsMCwwLC4yNjcuMTk1bDIuNjA2LjM4MWEuNTE5LjUxOSwwLDAsMSwuMjg2Ljg4NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04Ny44MSAtMTI3Ljk4KSIgZmlsbD0iIzUyYTlmZiIvPgo8L3N2Zz4K',
    re:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIyNS4zMTEiIHZpZXdCb3g9IjAgMCAyNSAyNS4zMTEiPgogIDxnIGlkPSLorqTor4EiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02LjM2MSAtMC4xMjkpIj4KICAgIDxwYXRoIGlkPSLot6/lvoRfNzk3IiBkYXRhLW5hbWU9Iui3r+W+hCA3OTciIGQ9Ik0yMC44NDIsMjUuMjgzQTUwLjQzNyw1MC40MzcsMCwwLDEsOS43LDI0LjljLS43NzMtLjEtMS41NDMtLjIxMy0yLjMxLS4zNDYtLjU2OS0uMDk0LTEuMDEzLS4zNjMtMS4wMTMtLjk4NEEyOS45MTcsMjkuOTE3LDAsMCwxLDYuNDM5LDIwLjJjLjEtLjk0NC45MzYtMS40LDEuNzc4LTEuNzExLDEuMDI5LS4zODYsMi4xMDktLjY1NSwzLjEzLTEuMDQ4czEuOTQxLS45NTcsMi4wOC0yLjE2NmEyLjEsMi4xLDAsMCwwLS43MzEtMi4wODksMy42ODcsMy42ODcsMCwwLDEtMS4zMTgtMS45NzMsMS4yNzMsMS4yNzMsMCwwLDAtLjQtLjU3NEEyLjEwNiwyLjEwNiwwLDAsMSwxMC4zNTcsOC4xYTEyLjQ4NywxMi40ODcsMCwwLDAsLjQwOC0yLjM5MSw2LjYsNi42LDAsMCwxLDEuNzk0LTQuMDRjMi41NjYtMi41MzIsOC40MDctMi4wNDIsOS43MiwyLjI2Mi4yNTYuODQ4LjMyOCwxLjc0My41MDksMi42MTZhMTIuNiwxMi42LDAsMCwwLC40NTUsMS43NzMsMi4yMjUsMi4yMjUsMCwwLDEtLjY0MywyLjIzNywzLjI3MSwzLjI3MSwwLDAsMC0uNTcxLjgsMTUuMjY5LDE1LjI2OSwwLDAsMC0uNzczLDEuMzgyYy0uOTEyLDEuOTc4LTIuNTc5LDMuNjYxLTIuNTY2LDUuOTkzYTYuNDg1LDYuNDg1LDAsMCwwLDMuNTQ2LDYuMDQ3Yy4xLjA1Ny4yMDcuMTE0LjQ1NS4yNS0uNzI2LjEtMS4yODQuMjE1LTEuODQ4LjI2MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMCkiIGZpbGw9IiM1MmE5ZmYiLz4KICAgIDxwYXRoIGlkPSLot6/lvoRfNzk4IiBkYXRhLW5hbWU9Iui3r+W+hCA3OTgiIGQ9Ik01NjAuMzc3LDUyMy42YTUuODc0LDUuODc0LDAsMSwwLDUuODc0LDUuODcyQTUuODc3LDUuODc3LDAsMCwwLDU2MC4zNzcsNTIzLjZabTQuMTI2LDQuODkyLTQuMzE5LDMuODE2YS45MDcuOTA3LDAsMCwxLTEuMjUxLS4wNTFsLTIuMDItMi4xYS45LjksMCwxLDEsMS4zLTEuMjU0bDEuNDE4LDEuNDc3LDMuNjY5LTMuMjRhLjkuOSwwLDAsMSwxLjIsMS4zNTVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTM0Ljg5MSAtNTEwLjg1NikiIGZpbGw9IiM1MmE5ZmYiLz4KICA8L2c+Cjwvc3ZnPgo='
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
    if(this.data.c){
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
    this.setData({ show_verification:true,c:false});
  }
  },

  // 前往身份认证
  goToVerification:function() {
    this.setData({ hideModal: true });
    this.setData({ show_verification: false ,c:true}); 
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

    setTimeout(function () {
      that.setData({
        c: true
      });
    }, 800)//执行完毕才能按
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
             console.log(res);
             that.setData({
               userpho:res.userInfo.avatarUrl,
               username:res.userInfo.nickName
             })
             wx.setStorage({
               data: res.userInfo,
               key: 'userInfo',
             })
             // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
             // 根据自己的需求有其他操作再补充
             // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
             wx.login({
               success: res => {
                 // 获取到用户的 code 之后：res.code
                 console.log(res);
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

  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      that.setData({
        userpho: e.detail.userInfo.avatarUrl,
        username: e.detail.userInfo.nickName
      })
      wx.setStorage({
        data: e.detail.userInfo,
        key: 'userInfo',
      })
     
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

