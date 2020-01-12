//app.js

var mqtt = require('lab/mqtt.js');



App({
  onLaunch: function () {
    
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success:function(res){
        that.globalData.userInfo=res.data
      },
      fail:function(res){
        console.log(res+'error');
      }
    })
    wx.login({
      complete: (res) => {
        that.getopenid(res.code)
      },
    })
  },

  getopenid:function(code){
    var that = this;
    wx.request({
      url: that.globalData.localhost+"/getuserid",      
      data:{
        "code":code,
      },
      success(res){
        that.globalData.userId=res.data.userid;
        console.log(that.globalData.userId);
      }
    })
  },

  connect:function(){
   
    //监听mq的返回
    client.on('message', function (topic, message, packet) {
      // message is Buffer
      console.log(topic)
      console.log("packet:",packet.payload.toString())
      client.end()
    })
  },
  globalData: {
    localhost:"http://192.168.5.19:8081",
    userInfo: null,
    restServiceBaseUrl: "http://localhost:8081/StayHomeRestServer.NETCoreEnvironment/rest/",
    openId: null,
    Id: null,
    APPID: "wx3878552fd022c398",
    APPSECRET: "9321186a5ee5f8aa1d5b59abfa785d8c",
    gameInfo: null,
    bottomBarRoute: '',
    ServerRoot: "https://www.yundingu.cn/checkerserver/",
    userId:null
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




})