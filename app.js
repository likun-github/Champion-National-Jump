//app.js
App({
  onLaunch: function () {
    var that = this;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)



    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.getUserInfo({
            success: function (res) {
              var objz = {};
              objz.avatarUrl = res.userInfo.avatarUrl;
              objz.nickName = res.userInfo.nickName;
              //console.log(objz);
              wx.setStorageSync('userInfo', objz);//存储userInfo
            }
          });
          var d = that.globalData;//这里存储了appid、secret、token串  
          var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.APPID + '&secret=' + d.APPSECRET + '&js_code=' + res.code + '&grant_type=authorization_code';
          wx.request({
            url: l,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
            // header: {}, // 设置请求的 header  
            success: function (res) {
              var obj = {};

              obj.openid = res.data.openid;
              obj.expires_in = Date.now() + res.data.expires_in;
              //console.log(obj);
              wx.setStorageSync('user', obj);//存储openid  
              that.globalData.openId = res.data.openid;

              console.log(res.data.openid);
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    this.GetUserGameInfo();

  },


  globalData: {
    userInfo: null,
    restServiceBaseUrl: "http://localhost:8082/StayHomeRestServer.NETCoreEnvironment/rest/",
    openId: null,
    Id: null,
    APPID: "wx3878552fd022c398",
    APPSECRET: "9321186a5ee5f8aa1d5b59abfa785d8c",
    gameInfo: null,
    bottomBarRoute: ''
  },

  // 获取用户身份认证情况
  GetUserGameInfo: function () {
    var that = this;
    wx.request({
      url: that.globalData.restServiceBaseUrl + "GetUserInfo",
      data: JSON.stringify({ RegisteredUserOpenId: that.globalData.openId }),
      success: function (res) {
        

        var registeredUser = res.data.RegisteredUser;

        //如果OpenId不存在那么用户还未注册，或提交注册
        if(registeredUser.RegisteredUserOpenId==""){


        }
        else{
          this.globalData.userInfo
          if(registeredUser.RegisteredUserRole==0){
            this.globalData.gameInfo = { role: "student", authenticated: registeredUser.RegisteredUserAuthenticated,info:res.data.student};
          }
          else if(registeredUser.RegisteredUserRole==1){
            this.globalData.gameInfo = { role: "tutor", authenticated: registeredUser.RegisteredUserAuthenticated,info: res.data.tutor };

          }
          else{
            this.globalData.gameInfo = { role: "constitution", authenticated: registeredUser.RegisteredUserAuthenticated,info: res.data.constitution};
          } 
          

        }

        // if (res.data.Role == 'a') {
        //   that.globalData.role = "student";
        // }
        // else if (res.data.Role == "b") {
        //   that.globalData.role = "constitution";
        // }
        // else if (res.data.Role == "c") {
        //   that.globalData.role = "coach";
        // }
        // else {
        //   that.globalData.role = null;
        // }



        // if (that.globalData.role != null) {
        //   that.GetRegisterInfo();
        // }
      }
    })
  },

  // 如何用户角色不为null，则获取用户信息

  GetRegisterInfo: function () {
    var that = this;
    var role = this.globalData.role;

    var procedure = "";
    switch (role) {
      case "student":
        procedure = "GetStudentInfo";
        break;
      case "constitution":
        procedure = "GetConstitutionInfo";
        break;
      case "coach":
        procedure = "GetCoachInfo";
        break;
      default:

    }

    wx.request({
      url: that.globalData.restServiceBaseUrl + procedure,
      data: { WechatId: that.globalData.WechatId },
      success: function (res) {
        that.globalData.RegisterInfo = res.data;
      }
    })
  },
  redict: function (e) {
    var that = this;
    var route = e.currentTarget.dataset.route;

    if (route == "me") {
      wx.redirectTo({
        url: '/pages/orgmenu/orgmenu',
      });
      that.bottomBarRoute = "me";
    }
    else if (route == "competition") {
      wx.redirectTo({
        url: '/pages/conpetition/competitionindex',
      })
      that.bottomBarRoute = "competition";
    }
    else if (route == "game") {
      wx.redirectTo({
        url: '/pages/game/game',
      });
      that.bottomBarRoute = "game";
    }
    else if (route == "chessmanual") {
      wx.redirectTo({
        url: '/pages/chessmanual/chessmanualindex',
      });
      that.bottomBarRoute = "chessmanual"
    }
    else if (route = "learn") {
      wx.redirectTo({
        url: '/pages/learn/learnindex',
      });
      that.bottomBarRoute = "learn";
    }

  }


})