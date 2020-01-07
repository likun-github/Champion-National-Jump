//app.js

var mqtt = require('lab/mqtt.js');
App({
  onLaunch: function () {
    var that = this;
   
    wx.login({
      success: (res) => {
        console.log(res)
        that.getuserid(res.code);
        
      },
    })
    


   



    // this.GetUserGameInfo();
    //this.connect();
    this.getinfo();
    
   

  },
  getuserid:function(code){
    wx.request({
      url: this.globalData.localhost+'/getuserid',
      data:{
        'code':code
      },
      success(res){
        console.log(res.data)
      }
    })

  },
  getinfo:function(){
    wx.request({
      url: 'http://127.0.0.1:8081/getinfo',
      data:{
        "userid":1,
      },
      success(res){
        console.log(res)
      }
      
    })

  },

  // connect:function(){
  //   const options = {
  //     connectTimeout: 4000, // 超时时间
  //     // 认证信息 按自己需求填写
  //     clientId: 'xxxx',
  //     userName: 'xxx',
  //     passWord: 'xxx',
  //   }
  //  // const client = mqtt.connect('wxs://www.yundingu.cn/wss/', options)
  //   const client = mqtt.connect('wx://127.0.0.1:3654', options)
  //   client.on('reconnect', (error) => {
  //     console.log('正在重连:', error)
  //   })

  //   client.on('error', (error) => {
  //     console.log('连接失败:', error)
  //   })

  //   client.on('connect', (e) => {
  //     console.log('成功连接服务器111')
  //     //订阅一个主题
      
  //     client.publish("Test/HD_AddUser", '{"userName":"liurongjie","passWord":"new","age":26, "email":"xddxxx.com", "tel":151111111}', console.log)
  //     client.subscribe('phoneT_' + 1, { qos: 2 }, function (err) {
  //       if (!err) {
  //         //client.publish('123', 'Hello mqtt')
  //         console.log("订阅成功")
  //       }

  //     })
  //     client.subscribe("hello/", function (err) {
  //       if (!err) {
  //         //client.publish('123', 'Hello mqtt')
  //         console.log("订阅成功")
  //       }

  //     })
  //   })
  //   //监听mq的返回
  //   client.on('message', function (topic, message, packet) {
  //     // message is Buffer
  //     console.log("packet", packet.payload.toString())
  //     client.end()
  //   })

  // },



  globalData: {
    localhost:'http://127.0.0.1:8081',
    userInfo: null,
    restServiceBaseUrl: "http://localhost:8082/StayHomeRestServer.NETCoreEnvironment/rest/",
    openId: null,
    Id: null,
    APPID: "wx3878552fd022c398",
    APPSECRET: "9321186a5ee5f8aa1d5b59abfa785d8c",
    gameInfo: null,
    bottomBarRoute: '',
    ServerRoot: "https://www.yundingu.cn/checkerserver/"
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
        url: '/pages/competition/competitionindex',
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