// pages/game/fastcompetition.js

var movegen = require('../../../utils/movegen.js');
var util = require('../../../utils/util.js');
var mqtt = require('../../../lab/mqtt.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    l:0,
    wm:'/static/wm.png',
    bm:'/static/bm.png',
    serverRoot: "",
    item:'',

    // 桌子信息
    table_info: null,

    // 用户信息
    checker_color: -1, // -1：未匹配完成，不知道是黑子还是白子，0：用户执白子，1：用户执黑子
    userName: -1,
    userAvatar: -1,
    userLevel: -1,
    userScore: -1,

    // 对手信息
    opponentID:-1,
    opponentName:-1,
    opponentLevel:-1,
    opponentScore:-1,

    // 上下文
    context: null,

    //canvas相关变量：canvas的长宽，和画图笔
    borderWidth: 15,
    chessBoardWidth: wx.getSystemInfoSync().windowWidth * (750 - 30/*margin*/ * 4) / (750) - 15 * 2,
    chessBoardHeight: wx.getSystemInfoSync().windowWidth * (750 - 30 * 4) / (750) - 15 * 2,

    // 棋数据
    blackChesses: [],
    whiteChesses: [],
    kingChesses: [],

    // 计时器
    whiteTimer: null,
    whiteSeconds: 0,
    whiteTimerText: "00:00:00",
    blackTimer: null,
    blackSeconds: 0,
    blackTimerText: "00:00:00",

    // 悔棋和棋都用的倒计时
    timeoutTimer: null,
    timeoutSeconds:15,

    // 悔棋相关
    withdrawSend:0, /*0：用户未点击 悔棋；1：用户点击 悔棋 */
    withdrawReceive:0, /*0：对手未点击 悔棋； 1：对手点击 悔棋 */
    withdrawNum:3, /*剩余悔棋次数 */
    withdrawResult:-1, /*-1：未收到对手是否同意悔棋；0：不同意；1：同意 */

    // 和棋相关
    drawWaiting:0, /*0：用户未点击 和棋；1：用户点击 和棋，等待和棋结果 */

    // 游戏结果
    gameResult: -1,  /*-1：未出结果；0：胜； 1：负； 2：和*/
    scoreDelta: 0,   /*比赛结束后积分变动的绝对值 */

    //现在的目前对象
    currentTarget: null,

    //代表现在出棋的一方： 0 代表白方, 1代表黑方
    currentUser: 0,

    // 当前选中棋子的可走路径
    currentAvailablePaths: [],

    // 当前选中棋子的可能终点
    currentAvailableDst: [],

    // 悔棋数据
    withdraw: [{ "W": movegen.fill50(1048575), "B": movegen.fill50(1125898833100800), "K": movegen.fill50(0) }],

    // 小程序棋盘索引转换成bitboard棋盘索引
    mini2Bit: [null, 45, null, 46, null, 47, null, 48, null, 49,
      40, null, 41, null, 42, null, 43, null, 44, null,
      null, 35, null, 36, null, 37, null, 38, null, 39,
      30, null, 31, null, 32, null, 33, null, 34, null,
      null, 25, null, 26, null, 27, null, 28, null, 29,
      20, null, 21, null, 22, null, 23, null, 24, null,
      null, 15, null, 16, null, 17, null, 18, null, 19,
      10, null, 11, null, 12, null, 13, null, 14, null,
      null, 5, null, 6, null, 7, null, 8, null, 9,
      0, null, 1, null, 2, null, 3, null, 4, null],

    // bitboard棋盘索引转换成小程序棋盘索引
    bit2Mini: [90, 92, 94, 96, 98,
      81, 83, 85, 87, 89,
      70, 72, 74, 76, 78,
      61, 63, 65, 67, 69,
      50, 52, 54, 56, 58,
      41, 43, 45, 47, 49,
      30, 32, 34, 36, 38,
      21, 23, 25, 27, 29,
      10, 12, 14, 16, 18,
      1, 3, 5, 7, 9],

    // 转换成Scan的棋盘索引
    mini2Scan: [null, 1, null, 2, null, 3, null, 4, null, 5,
      6, null, 7, null, 8, null, 9, null, 10, null,
      null, 11, null, 12, null, 13, null, 14, null, 15,
      16, null, 17, null, 18, null, 19, null, 20, null,
      null, 21, null, 22, null, 23, null, 24, null, 25,
      26, null, 27, null, 28, null, 29, null, 30, null,
      null, 31, null, 32, null, 33, null, 34, null, 35,
      36, null, 37, null, 38, null, 39, null, 40, null,
      null, 41, null, 42, null, 43, null, 44, null, 45,
      46, null, 47, null, 48, null, 49, null, 50, null],

      client: 0
  },


  //截图
 cutpic:function() {
  const _this = this
  return new Promise((resolve, reject) => {
     setTimeout(() => {
     wx.canvasToTempFilePath({//调用方法，开始截取
      x: 0,
      y: 0,
      width: _this.data.chessBoardWidth,
      height: _this.data.chessBoardHeight,
      destWidth: 375,
      destHeight: 375,
      canvasId: 'chessboard',
      success: function (res) {
      resolve(res.tempFilePath)
      console.info('canvas', res.tempFilePath)
      
      _this.setData({
       item: res.tempFilePath
      })
      },
      fail: function (err) {
      reject(err)
      console.info(err)
      }
     })
     }, 1000) // 渲染时间
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户的微信名以及微信头像
    this.setData({
      userName: getApp().globalData.userInfo.nickName,
      userAvatar: getApp().globalData.userInfo.avatarUrl,
    });

    // 连接服务器，开始匹配
    this.data.client = mqtt.connect('wx://47.107.157.238:3654');
    var userid = getApp().globalData.userId;
    const user_id = {
      "userid": userid.toString()
    }
    this.data.client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    });
    this.data.client.on('error', (error) => {
      console.log('连接失败:', error)
    });
    this.data.client.on('connect', (e) => {
      console.log('成功连接服务器!')  
    });
    this.data.client.publish("Jump/HD_GetUsableTable",JSON.stringify(user_id), console.log);
    var that = this;
    this.data.client.on('message', function (topic, message, packet) { 
        console.log(topic)
        //console.log("packet:",packet.payload.toString());
        if(topic == "MatchFinish") { // 匹配成功
          var match_result = JSON.parse(packet.payload);
          console.log(match_result);
          if (userid == match_result.w_uid) { // 当前用户执白子
            that.setData({
              opponentID: match_result.b_uid,
              opponentName: match_result.b_name,
              opponentScore: match_result.b_score,
              opponentLevel:match_result.b_level,
              userScore: match_result.w_score,
              userLevel: match_result.w_level,
              checker_color: 0
            });
          } else { // 当前用户执黑子
            that.setData({
              opponentID: match_result.w_uid,
              opponentName: match_result.w_name,
              opponentScore: match_result.w_score,
              opponentLevel:match_result.w_level,
              userScore: match_result.b_score,
              userLevel: match_result.b_level,
              checker_color: 1
            });
          }
          that.startTimer();
        } else if (topic == "TableInfo") { // 已经找到了桌子
          var table_info = JSON.parse(packet.payload);
          console.log(table_info);
          that.setData({table_info: table_info.BigRoomId});
        } else if (topic == "UpdateComposition" && that.data.currentUser != that.data.checker_color) { // 对手已完成走子，更新棋局，把新棋局加入悔棋list内，更新走子方
          // 获取新棋局，是bitboard的形式
          var new_composition = JSON.parse(packet.payload);
          console.log(new_composition);
          var new_composition_bitboard = { "W": new_composition.W, "B": new_composition.B, "K": new_composition.K }
          // 把bitboard转换成小程序可用的形式
          that.Bitboard2Miniboard(new_composition_bitboard);
          // 重新绘制棋盘
          that.DrawBoard();
          that.DrawChesses();
          that.data.context.draw();
          // 把新棋局加入悔棋数据内并更新走子方
          that.data.withdraw.push(new_composition_bitboard);
          if(that.data.checker_color == 0) { // 用户执白子，改成白子行棋    
            that.setData({currentUser:0});
          } else { // 用户执黑子，改成黑子行棋
            that.setData({currentUser:1});
          } 
          // 开启计时器
          that.startTimer();  
        } else if (topic == "WithdrawRequested") { // 控制方发送悔棋请求
          that.setData({withdrawReceive:1});
          that.countDown();
        } else if (topic == "WithdrawDecided") { // 非控制方决定是否同意悔棋
          var withdraw_result = JSON.parse(packet.payload)
          if (withdraw_result.withdraw_agreed == 0) { // 非控制方拒绝控制方悔棋
            that.setData({withdrawResult:0});
          } else { // 非控制方同意悔棋
            that.setData({withdrawResult:1});
          }
        } else if (topic == "DrawRequested") { // 控制方发送求和请求
          wx.showModal({
            title: "对手求和啦",
            content: "您有15s时间做决定",
            confirmText: "同意",   
            confirmColor: "skyblue",
            showCancel: true,
            cancelText: "拒绝",
            cancelColor: "black",

            success: function (res) {
              var drawAgreed = -1;
              if (res.cancel) { // 拒绝和棋请求
                drawAgreed = 0;
              } else { // 同意和棋请求
                drawAgreed = 1;
              }
              const draw_agreed = {
                "drawAgreed": drawAgreed
              }
              that.data.client.publish("Jump/HD_DrawDecided",JSON.stringify(draw_agreed), console.log);
            }
          })
        } else if (topic == "DrawDenied") { // 非控制方不同意和棋请求
          wx.showModal({
            title: "对手拒绝和棋请求",
            content: "轮到您方走子",
            confirmText: "好的", 
            confirmColor: "skyblue",
            showCancel: false,
          })
        } else if (topic == "DrawAgreed") { // 非控制方同意和棋请求
          wx.showModal({
            title: "对手同意和棋请求",
            content: "请等待服务器结算分数",
            confirmText: "好的", 
            confirmColor: "skyblue",
            showCancel: false,
          })
        } else if (topic == "OpponentLost") { // 对手认输了
          wx.showModal({
            title: "对手认输啦",
            content: "请等待服务器结算分数",
            confirmText: "好的", 
            confirmColor: "skyblue",
            showCancel: false,
          })
        } else if (topic == "GameEnd") {
          var game_result = JSON.parse(packet.payload);
          console.log(game_result);
          if (userid == game_result.w_uid) { // 当前用户执白子
            that.setData({gameResult:game_result.w_result,
                          scoreDelta:Math.abs(game_result.w_score - that.data.userScore)});
          } else if (userid == game_result.b_uid) { // 当前用户执黑子
            that.setData({gameResult:game_result.b_result,
                          scoreDelta:Math.abs(game_result.b_score - that.data.userScore)});
          }
        }
    });

   
    // 设置服务器路径
    var serverRoot = getApp().globalData.ServerRoot;
    this.setData({ serverRoot: serverRoot });

    var context = wx.createCanvasContext('chessboard');
    this.setData({ context: context });

    this.Inite();
     if(this.data.opponentID==null){
       this.setData({
         l:-1000
       })
     }
    // 清除计时器,否则分享页面给别人时计时器会在原来的基础上跑跑跑
    if (this.data.whiteTimer != null) {
      clearInterval(this.data.whiteTimer);
    }
    if (this.data.blackTimer != null) {
      clearInterval(this.data.blackTimer);
    }
    this.setData({ whiteTimer: null });
    this.setData({ whiteSeconds: 0 });
    this.setData({ whiteTimerText: "00:00:00" });
    this.setData({ blackTimer: null });
    this.setData({ blackSeconds: 0 });
    this.setData({ blackTimerText: "00:00:00" });
    this.setData({ currentUser: 0 });

    context.draw();
    
    
  this.cutpic();
  },

  // 秒数 => 时：分：秒
  formatTime(seconds) {
    return [
      parseInt(seconds / 60 / 60),
      parseInt(seconds / 60 % 60),
      parseInt(seconds % 60)
    ]
      .join(":")
      .replace(/\b(\d)\b/g, "0$1");
  },

  // 开启计时器
  startTimer: function () {
    var that = this;
    if (this.data.currentUser == 0) { // 白棋计时器
      if (that.data.blackTimer != null) {
        clearInterval(that.data.blackTimer);
      }
      that.data.whiteTimer = setInterval(function () {
        let seconds = that.data.whiteSeconds + 1;
        that.setData({ whiteSeconds: seconds });
        that.setData({ whiteTimerText: that.formatTime(seconds) });
      }, 1000);
    } else { // 黑棋计时器
      clearInterval(that.data.whiteTimer);
      that.data.blackTimer = setInterval(function () {
        let seconds = that.data.blackSeconds + 1;
        that.setData({
          blackSeconds: seconds,
          blackTimerText: that.formatTime(seconds)
        });
      }, 1000);
    }
  },

  // 开启倒计时
  countDown: function () {
    let countDownNum = this.data.timeoutSeconds;
    var that = this;
    this.setData({
      timeoutTimer: setInterval(function () {
        // 计时器归零前：修改变量，且如果用户在归零前做出了决定，则停止计时器
        countDownNum--;
        that.setData({
          timeoutSeconds: countDownNum
        })
        if(that.data.withdrawReceive == 0) { // 用户已经做出了决定
          clearInterval(that.data.timeoutTimer);
          // 计时器初始化，留待下次备用
          that.setData({
            timeoutSeconds: 15
          })
        }
        // 计时器归零后
        if (countDownNum == 0) {
          clearInterval(that.data.timeoutTimer);
          const withdraw_decided = {
            "withdrawAgreed":1
          }
          that.data.client.publish("Jump/HD_WithdrawDecided",JSON.stringify(withdraw_decided), console.log);
          that.setData({withdrawReceive:0});
          // 把一轮棋局清出
          that.data.withdraw.pop();
          that.data.withdraw.pop();
          // 获取悔棋后的棋局
          let currentBitboard = that.data.withdraw.pop();
          that.Bitboard2Miniboard(currentBitboard);
          that.data.withdraw.push(currentBitboard);
     
          // 重新绘制棋盘
          that.DrawBoard();
          that.DrawChesses();
          that.data.context.draw();   
          // 计时器初始化，留待下次备用
          that.setData({
            timeoutSeconds: 15
          })
        }       
      }, 1000)
    });
  },

  // 清空棋子
  clearBoard: function () {
    this.setData({ whiteChesses: [] });
    this.setData({ blackChesses: [] });
    this.setData({ kingChesses: [] });

    for (let i = 0; i < 100; i++) {
      this.data.whiteChesses.push(0);
      this.data.blackChesses.push(0);
      this.data.kingChesses.push(0);
    }
  },

  // 初始化棋盘
  Inite: function () {
    // 初始化棋盘-清空棋子
    this.clearBoard();
    // 初始化棋盘-填棋
    for (let i = 0; i < 100; i++) {
      // 黑棋
      if (i <= 39 && (Math.floor(i / 10) + i) % 2 == 1) {
        this.data.blackChesses[i] = 1;
      }
      // 白棋
      if (i >= 60 && (Math.floor(i / 10) + i) % 2 == 1) {
        this.data.whiteChesses[i] = 1;
      }
    }
    this.DrawBoard();
    this.DrawChesses();
  },

  // 绘制棋盘
  DrawBoard: function () {
    // 绘制棋盘底色
    var width = this.data.chessBoardWidth
    var height = this.data.chessBoardHeight
    var context = this.data.context;
    context.setFillStyle("rgb(225, 240, 255)");
    // 绘制棋盘方格
    context.fillRect(0, 0, width, height);
    context.setFillStyle("rgb(76, 135, 253)");
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 5; j++) {
        if (i % 2 == 0) { // 奇数行
          context.fillRect((1 + j * 2) * width / 10, i * height / 10, width / 10, height / 10);
        } else { // 偶数行
          context.fillRect((j * 2) * width / 10, i * height / 10, width / 10, height / 10);
        }
      }
    }
    // 绘制棋盘数字
    context.setFillStyle("rgb(255, 255, 255)");
    context.setFontSize(7);
    let number = 1;
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 5; j++) {
        if (i % 2 == 0) { // 奇数行
          context.fillText(number.toString(), (1 + j * 2) * width / 10 + 2, i * height / 10 + 9);
        } else { // 偶数行
          context.fillText(number.toString(), (j * 2) * width / 10 + 2, i * height / 10 + 9)
        }
        number++;
      }
    }
  },

  // 画所有棋子
  DrawChesses: function () {
    var context = this.data.context;
    //  canvas的context对象是关于状态的，如果不使用beginpath和closepath
    // 分段则画笔颜色以最后一次为例

    context.beginPath();
    // 画黑色棋
    for (let i = 0; i < this.data.blackChesses.length; i++) {
      if (this.data.blackChesses[i] == 1) {
        //this.DrawChess(i, context);
        var width = this.data.chessBoardWidth / 10;
        var center = this.GetRectCenter(Math.floor(i / 10), i % 10, this.data.chessBoardWidth, this.data.chessBoardHeight);
        context.drawImage(this.data.bm, center.x - width / 2 + width / 8, center.y - width / 2 + width / 8, width * 6 / 8, width * 6 / 8);
      }
    }
    context.closePath();
    context.setFillStyle("black");
    context.fill();

    context.beginPath();
    // 画白色棋
    for (let i = 0; i < this.data.whiteChesses.length; i++) {
      if (this.data.whiteChesses[i] == 1) {
        //this.DrawChess(i, context)
        var width = this.data.chessBoardWidth / 10;
        var center = this.GetRectCenter(Math.floor(i / 10), i % 10, this.data.chessBoardWidth, this.data.chessBoardHeight);
        context.drawImage(this.data.wm, center.x - width / 2 + width / 8, center.y - width / 2 + width / 8, width * 6 / 8, width * 6 / 8);
      }
    }
    context.closePath();
    context.setFillStyle("white");
    context.fill();

    //画王  
    for (let i = 0; i < this.data.kingChesses.length; i++) {
      if (this.data.kingChesses[i] == 1) {
        var width = this.data.chessBoardWidth / 10 / 2;
        var center = this.GetRectCenter(Math.floor(i / 10), i % 10, this.data.chessBoardWidth, this.data.chessBoardHeight);
        context.drawImage(this.data.serverRoot +"/img/king.png", center.x - width / 2, center.y - width / 2, width, width);
      }
    }
  },

  // 根据index画单个棋子
  DrawChess: function (index, ctx) {
    var width = this.data.chessBoardWidth
    var height = this.data.chessBoardHeight

    var i = Math.floor(index / 10);
    var j = index % 10;

    // context与上次操作无关时，需要使用moveTo移动画笔，
    // 不然context会记录中间路径
    ctx.moveTo(width / 10 / 2 + j * width / 10, height / 10 / 2 + i * height / 10);
    ctx.arc(width / 10 / 2 + j * width / 10, height / 10 / 2 + i * height / 10, width / 10 / 2 * 4 / 5, 0, 2 * Math.PI, true)
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 高亮选中的棋子
  HighlightChess: function (index, color) {
    var width = this.data.chessBoardWidth
    var height = this.data.chessBoardHeight
    var context = this.data.context;

    context.setFillStyle(color);
    let i = Math.floor(index / 10);
    let j = index % 10;
    context.fillRect(j * width / 10, i * height / 10, width / 10, height / 10);
  },

  // 获取选中位置的棋盘索引
  GetTargetRect(x, y) {
    var width = this.data.chessBoardWidth
    var height = this.data.chessBoardHeight

    return Math.floor(x / (width / 10)) + Math.floor(y / (height / 10)) * 10;
  },

  // 获取可走路径
  GetAvailablePaths(currentUser) {
    let bitboard = movegen.miniProgramBoardToBitBoard(this.data.whiteChesses, this.data.blackChesses, this.data.kingChesses);
    let checkerBoard = new movegen.CheckerBitboard(bitboard["W"], bitboard["B"], bitboard["K"]);
    let checkerMoveList = new movegen.CheckerMoveList(checkerBoard);
    if (currentUser == 0) {
      checkerMoveList.findMovesWhite(checkerBoard);
    } else {
      checkerMoveList.findMovesBlack(checkerBoard);
    }
    let availableMoves = checkerMoveList.movesExtraction();

    var paths = [];
    if (availableMoves.length > 0) {
      for (let i = 0; i < availableMoves.length; i++) {
        if (availableMoves[i].layer == 0) { // 普通移动或单步跳吃
          let kill = [];
          kill.push(availableMoves[i].kill);
          paths.push({ src: availableMoves[i].src, kill: kill, pass: null, dst: availableMoves[i].dst });
        } else { // 多步跳吃 
          let kill = [];
          let pass = [];
          let temp = availableMoves[i];
          let src = -1;
          while (temp != null) {
            kill.push(temp.kill);
            pass.push(temp.src);
            if (temp.layer == 1) {
              src = temp.parent.src;
            }
            temp = temp.parent;
          }
          paths.push({ src: src, kill: kill, pass: pass, dst: availableMoves[i].dst });
        }
      }
    }
    return paths;
  },

  // 判断index这个棋子是否可走
  IsMovable(index, paths) {
    for (let i = 0; i < paths.length; i++) {
      if (paths[i]["src"] == index) {
        return true;
      }
    }
    return false;
  },

  // 获取当前 选中棋子的 可走路径
  GetCurrentAvailablePaths(index, paths) {
    let availablePaths = [];
    for (let i = 0; i < paths.length; i++) {
      if (paths[i]["src"] == index) {
        availablePaths.push(paths[i]);
      }
    }
    return availablePaths;
  },

  // 获取当前 选中棋子的 可走路径的终点
  GetCurrentAvailableDst(currentAvailablePaths) {
    let availableDst = [];
    for (let i = 0; i < currentAvailablePaths.length; i++) {
      availableDst.push(currentAvailablePaths[i]["dst"]);
    }
    return availableDst;
  },

  // 在可选路径上画绿点 
  DrawInfoPaths(index, paths) {
    //var that = this;
    var context = this.data.context;
    var width = this.data.chessBoardWidth
    var height = this.data.chessBoardHeight

    for (let i = 0; i < paths.length; i++) {
      this.drawAvailablePath(paths[i], context, width, height);
    }
  },

  // 画绿点
  drawAvailablePath(index, context, width, height) {
    var R = width / 10 / 2 * 1 / 5;

    var col = Math.floor((index) / 10);
    var row = (index) % 10;

    var center = this.GetRectCenter(col, row, width, height);

    context.moveTo(center.x, center.y);
    context.arc(center.x, center.y, R, 0, 2 * Math.PI, true)
    context.setFillStyle("green");
    context.fill();
  },

  // 获取中心点坐标
  GetRectCenter(col, row, width, height) {
    return { x: width / 10 / 2 + row * width / 10, y: height / 10 / 2 + col * height / 10 }
  },

  // 判断index这个棋子是否为当前 选中棋子的 终点
  IsDst(index, availableDst) {
    for (let i = 0; i < availableDst.length; i++) {
      if (index == availableDst[i]) {
        return true;
      }
    }
    return false;
  },

  // 获取终点为index的路径
  GetTargetPath(index, paths) {
    for (let i = 0; i < paths.length; i++) {
      if (paths[i]["dst"] == index) {
        return paths[i];
      }
    }
  },

  // 把pass的路径补充完整
  FillPass(pass, dst) {
    let pass_filled = [];
    pass.reverse();
    pass.push(dst);
    for (let i = 0; i < pass.length - 1; i++) {
      pass_filled.push(pass[i]);
      if ((pass[i + 1] - pass[i]) % 9 == 0) { // 9的倍数
        let j = 1;
        if (pass[i + 1] > pass[i]) {
          while (pass[i] + j * 9 < pass[i + 1]) {
            pass_filled.push(pass[i] + j * 9);
            j++;
          }
        } else {
          while (pass[i] - j * 9 > pass[i + 1]) {
            pass_filled.push(pass[i] - j * 9);
            j++;
          }
        }
      } else if ((pass[i + 1] - pass[i]) % 11 == 0) { // 11的倍数
        let j = 1;
        if (pass[i + 1] > pass[i]) {
          while (pass[i] + j * 11 < pass[i + 1]) {
            pass_filled.push(pass[i] + j * 11);
            j++;
          }
        } else {
          while (pass[i] - j * 11 > pass[i + 1]) {
            pass_filled.push(pass[i] - j * 11);
            j++;
          }
        }
      } else { // bug
        console.log("这是一个bug，你算错了");
      }
    }
    return pass_filled;
  },

  // 从小程序棋盘表示法转换成bitboard棋盘表示法
  MiniBoard2Bitboard() {
    let W = movegen.fill50(0);
    let B = movegen.fill50(0);
    let K = movegen.fill50(0);
    for (let i = 0; i < 100; i++) {
      if (this.data.mini2Bit[i] != null) { // 属于可摆棋位
        if (this.data.whiteChesses[i] == 1) {
          W = movegen.Or(W, movegen.Shift(movegen.fill50(1), this.data.mini2Bit[i], 'l'));
        }
        if (this.data.blackChesses[i] == 1) {
          B = movegen.Or(B, movegen.Shift(movegen.fill50(1), this.data.mini2Bit[i], 'l'));
        }
        if (this.data.kingChesses[i] == 1) {
          K = movegen.Or(K, movegen.Shift(movegen.fill50(1), this.data.mini2Bit[i], 'l'));
        }
      }
    }
    let currentBitboard = { "W": W, "B": B, "K": K };
    return currentBitboard;
  },


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 点击棋盘事件
  TapBoard: function (e) {
    // 获取当前点击位置在画布上的坐标
    var x = e.detail.x - e.currentTarget.offsetLeft - this.data.borderWidth;
    var y = e.detail.y - e.currentTarget.offsetTop - this.data.borderWidth;

    // 获取点击的格子的index
    var targetRect = this.GetTargetRect(x, y);

    // 获取当前 所有的 可走路径
    let paths = [];

    paths = this.GetAvailablePaths(this.data.currentUser);
    if (paths.length == 0) { // 当前方无子可走,弹出游戏结束对话框
      var that = this;
      if (this.data.currentUser == 0) {
        wx.showModal({
          title: "游戏结束",
          content: "您输啦！",
          confirmText: "收藏本局",   // 收藏本局，然后再来一局 
          confirmColor: "skyblue",
          showCancel: true,
          cancelText: "再来一局",    // 再来一局
          cancelColor: "black",

          success: function (res) {
            if (res.cancel) {
            } else {
              that.collect("l");// 收藏本局
            }
            that.onLoad(); // 再来一局
          }
        })
      } else {
        wx.showModal({
          title: "游戏结束",
          content: "您赢啦！",
          confirmText: "收藏本局",   // 收藏本局，然后再来一局 
          confirmColor: "skyblue",
          showCancel: true,
          cancelText: "再来一局",    // 再来一局
          cancelColor: "black",

          success: function (res) {
            if (res.cancel) {
            } else {
              that.collect("w");// 收藏本局
            }
            that.onLoad(); // 再来一局
          }
        })
      }
    }

    if (this.data.currentUser == this.data.checker_color) { // 轮到用户走棋，先判断选中的是否为所走棋，再判断选中的是否为可走棋的终点，完成走棋后，把走子后的棋局转成bitboard格式，发送到服务器
      // 如果选中可走棋，则高亮这个棋子，并画出其可走路径
      if (this.IsMovable(targetRect, paths)) {
        this.setData({ currentTarget: { index: targetRect, king: this.data.kingChesses[targetRect] == 1 } });
        let currentAvailablePaths = this.GetCurrentAvailablePaths(targetRect, paths);
        let currentAvailableDst = this.GetCurrentAvailableDst(currentAvailablePaths);
        this.setData({ currentAvailablePaths: this.GetCurrentAvailablePaths(targetRect, paths) });
        this.setData({ currentAvailableDst: this.GetCurrentAvailableDst(currentAvailablePaths) });
        // 这一部分需要优化
        this.DrawBoard();
        this.HighlightChess(targetRect, "red");
        this.DrawInfoPaths(targetRect, currentAvailableDst);
        this.DrawChesses();
        this.data.context.draw();
      } else if (this.data.currentTarget && this.IsDst(targetRect, this.data.currentAvailableDst)) { // 如果选中 当前选中棋子的 可走路径的终点，则完成这项操作
        // 获取所选路径并提取出pass，kill，dst等相关信息      
        let targetPath = this.GetTargetPath(targetRect, this.data.currentAvailablePaths);
        let src = this.data.currentTarget["index"];
        let pass = targetPath["pass"];
        if (pass != null) { // 把pass的路径补充完整
          pass = this.FillPass(pass, dst);
        }
        let kill = targetPath["kill"];
        let dst = targetPath["dst"];
        let isKilledKing = [];

        // 更改棋盘-绘制空棋盘
        this.DrawBoard();
        // 更改棋盘-绘制经过的棋位
        if (pass != null) {
          for (let i = 0; i < pass.length; i++) {
            this.HighlightChess(pass[i], "purple");
          }
        }
        // 更改棋盘
        if(this.data.currentUser == 0) { // 用户执白子
          // 更改棋盘-更改白棋数组
          this.data.whiteChesses[src] = 0;
          this.data.whiteChesses[dst] = 1;
          // 更改棋盘-如果白棋到达顶部则变为王棋
          if (Math.floor(dst / 10) == 0) {
            this.data.kingChesses[dst] = 1;
          }
          // 更改棋盘-去掉被吃的黑棋，并绘制被吃的黑棋
          if (kill[0] != null) {
            for (let i = 0; i < kill.length; i++) {
              this.HighlightChess(kill[i], "blue");
              this.data.blackChesses[kill[i]] = 0;
              if (this.data.kingChesses[kill[i]] == 0) { // 被吃子不是王棋
              } else { // 被吃子是王棋
                this.data.kingChesses[kill[i]] = 0;
              }
            }
          }
        } else { // 用户执黑子
          // 更改棋盘-更改黑棋数组
          this.data.blackChesses[src] = 0;
          this.data.blackChesses[dst] = 1;
          // 更改棋盘-如果黑棋到达底部则变为王棋
          if (Math.floor(dst / 10) == 9) {
            this.data.kingChesses[dst] = 1;
          }
          // 更改棋盘-去掉被吃的白棋，并绘制被吃的白棋
          if (kill[0] != null) {
            for (let i = 0; i < kill.length; i++) {
              this.HighlightChess(kill[i], "blue");
              this.data.whiteChesses[kill[i]] = 0;
              if (this.data.kingChesses[kill[i]] == 0) { // 被吃子不是王棋
              } else { // 被吃子是王棋
                this.data.kingChesses[kill[i]] = 0;
              }
            }
          }
        }
        
        // 更改棋盘-如果是移动的是王棋，则更改王棋数组
        if (this.data.kingChesses[src] == 1) {
          this.data.kingChesses[src] = 0;
          this.data.kingChesses[dst] = 1;
        }
        
        
        // 更改棋盘-绘制起点、终点
        this.HighlightChess(src, "red");
        this.HighlightChess(dst, "red");
        // 更改棋盘-绘制所有棋子
        this.DrawChesses();
        this.data.context.draw();

        // 清空当前选中棋子信息
        this.setData({ currentTarget: null, availablePaths: null });

        // 把当前棋盘转换成bitboard棋盘
        var current_bitboard = this.MiniBoard2Bitboard();

        // 更换当前走子方，并将走子新棋局存在withdraw中
        this.data.withdraw.push(current_bitboard);
        if(this.data.currentUser == 0) { // 用户执白子
          this.setData({ currentUser: 1 });    
        } else { // 用户执黑子
          this.setData({ currentUser: 0 });
        }
               
        // 把当前棋局上传服务器
        const current_bitboard_json = {
          "W":current_bitboard["W"],
          "B":current_bitboard["B"],
          "K":current_bitboard["K"],
        }
        this.data.client.publish("Jump/HD_Control",JSON.stringify(current_bitboard_json), console.log)

        // 转换计时器
        this.startTimer();
      }
    } 
  },
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 认输
  lose: function () {
    var that = this;
    wx.showModal({
      title: "您确定要认输吗？",
      confirmText: "是的",   // 收藏本局，然后再来一局 
      confirmColor: "skyblue",
      showCancel: true,
      cancelText: "取消",    // 再来一局
      cancelColor: "black",

      success: function (res) {
        if (res.cancel) {
        } else {
          const checker_color = {
            "checkercolor":that.data.checker_color
          }
          that.data.client.publish("Jump/HD_Lose",JSON.stringify(checker_color), console.log);
        }
      }
    })    
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 从bitboard棋盘表示法转换成小程序棋盘表示法
  Bitboard2Miniboard(bitboard) {
    this.clearBoard();
    let W = bitboard["W"];
    let B = bitboard["B"];
    let K = bitboard["K"];
    while (W != 0) {
      let index = movegen.findLowBit(W);
      W = movegen.And(W, movegen.Not(movegen.Shift(movegen.fill50(1), index, 'l')));
      this.data.whiteChesses[this.data.bit2Mini[index]] = 1;
    }
    while (B != 0) {
      let index = movegen.findLowBit(B);
      B = movegen.And(B, movegen.Not(movegen.Shift(movegen.fill50(1), index, 'l')));
      this.data.blackChesses[this.data.bit2Mini[index]] = 1;
    }
    while (K != 0) {
      let index = movegen.findLowBit(K);
      K = movegen.And(K, movegen.Not(movegen.Shift(movegen.fill50(1), index, 'l')));
      this.data.kingChesses[this.data.bit2Mini[index]] = 1;
    }
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 点击求和
  draw:function () {
    var that = this;
    wx.showModal({
      title: "您确定要求和吗？",
      confirmText: "是的",   // 收藏本局，然后再来一局 
      confirmColor: "skyblue",
      showCancel: true,
      cancelText: "取消",    // 再来一局
      cancelColor: "black",

      success: function (res) {
        if (res.cancel) {
        } else {
          that.setData({drawSend:1}); // 控制方请求和棋
          var draw_request = {
            "draw_request":1
          }
          that.data.client.publish("Jump/HD_Draw",JSON.stringify(draw_request), console.log);  
        }
      }
    })  
  },
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////




  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 点击悔棋
  withdraw: function () {
    if (this.data.withdraw.length >= 3) { // 双方各走了一步后，才有悔棋可能
      this.setData({withdrawSend:1}); // 用户可以悔棋，弹出确认是否悔棋的对话框  
    } else { // 不可以悔棋
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "你还没走棋，不能悔棋！",
      })
    }
  },

  // 悔棋相关对话框中的取消/拒绝的消息处理函数
  noWithdraw: function() {
    if(this.data.withdrawSend == 1) {  // 控制方还有悔棋机会，但点击了悔棋按钮后决定不悔棋
      this.setData({withdrawSend:0});
    } else if (this.data.withdrawReceive == 1) { // 非控制方决定不接受控制的悔棋
      const withdraw_decided = {
        "withdrawAgreed":0
      }
      this.data.client.publish("Jump/HD_WithdrawDecided",JSON.stringify(withdraw_decided), console.log);
      this.setData({withdrawReceive:0});
    }
  },

  // 悔棋相关对话框中的继续/接受的消息处理函数
  yesWithdraw: function() {
    // 控制方还有悔棋机会，点击了悔棋按钮后决定继续悔棋
    if(this.data.withdrawSend == 1) {
      const user_id = {
        "userid":"2"
      }
      this.data.client.publish("Jump/HD_Withdraw",JSON.stringify(user_id), console.log);
      this.setData({withdrawSend:0});
    } else if (this.data.withdrawReceive == 1) { // 非控制方决定接受控制的悔棋
      const withdraw_decided = {
        "withdrawAgreed":1
      }
      this.data.client.publish("Jump/HD_WithdrawDecided",JSON.stringify(withdraw_decided), console.log);
      this.setData({withdrawReceive:0});
      // 把一轮棋局清出
      this.data.withdraw.pop();
      this.data.withdraw.pop();
      // 获取悔棋后的棋局
      let currentBitboard = this.data.withdraw.pop();
      this.Bitboard2Miniboard(currentBitboard);
      this.data.withdraw.push(currentBitboard);
     
      // 重新绘制棋盘
      this.DrawBoard();
      this.DrawChesses();
      this.data.context.draw();   
      
    }
  },

  // 悔棋相关对话框中的所有继续游戏按钮的消息处理函数
  acceptContinue:function() {
    if(this.data.withdrawSend == 1) { // 用户没有悔棋机会，继续游戏
      this.setData({withdrawSend:0});
    } else if (this.data.withdrawResult == 0) { // 非控制方不同意悔棋
      this.setData({withdrawResult:-1});
    } else if (this.data.withdrawResult == 1) { // 非控制方同意悔棋
      // 把一轮棋局清出
      this.data.withdraw.pop();
      this.data.withdraw.pop();
      this.setData({withdrawNum:this.data.withdrawNum - 1});
      // 获取悔棋后的棋局
      let currentBitboard = this.data.withdraw.pop();
      this.Bitboard2Miniboard(currentBitboard);
      this.data.withdraw.push(currentBitboard);
      
      // 重新绘制棋盘
      this.DrawBoard();
      this.DrawChesses();
      this.data.context.draw();   
      this.setData({withdrawResult:-1});
    }
    
  },
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 初始化数据
  initialize:function() {
    this.setData({
      l: 0,
      wm: '/static/wm.png',
      bm: '/static/bm.png',
      serverRoot: "",
      item: '',

      // 桌子信息
      table_info: null,

      // 用户信息
      checker_color: -1, // -1：未匹配完成，不知道是黑子还是白子，0：用户执白子，1：用户执黑子
      userName: -1,
      userAvatar: -1,
      userLevel: -1,
      userScore: -1,

      // 对手信息
      opponentID: -1,
      opponentName: -1,
      opponentLevel: -1,
      opponentScore: -1,

      // 上下文
      context: null,

      //canvas相关变量：canvas的长宽，和画图笔
      borderWidth: 15,
      chessBoardWidth: wx.getSystemInfoSync().windowWidth * (750 - 30/*margin*/ * 4) / (750) - 15 * 2,
      chessBoardHeight: wx.getSystemInfoSync().windowWidth * (750 - 30 * 4) / (750) - 15 * 2,

      // 棋数据
      blackChesses: [],
      whiteChesses: [],
      kingChesses: [],

      // 计时器
      whiteTimer: null,
      whiteSeconds: 0,
      whiteTimerText: "00:00:00",
      blackTimer: null,
      blackSeconds: 0,
      blackTimerText: "00:00:00",

      // 悔棋和棋都用的倒计时
      timeoutTimer: null,
      timeoutSeconds: 15,

      // 悔棋相关
      withdrawSend: 0, /*0：用户未点击 悔棋；1：用户点击 悔棋 */
      withdrawReceive: 0, /*0：对手未点击 悔棋； 1：对手点击 悔棋 */
      withdrawNum: 3, /*剩余悔棋次数 */
      withdrawResult: -1, /*-1：未收到对手是否同意悔棋；0：不同意；1：同意 */

      // 和棋相关
      drawWaiting: 0, /*0：用户未点击 和棋；1：用户点击 和棋，等待和棋结果 */

      // 游戏结果
      gameResult: -1,  /*-1：未出结果；0：胜； 1：负； 2：和*/
      scoreDelta: 0,   /*比赛结束后积分变动的绝对值 */

      //现在的目前对象
      currentTarget: null,

      //代表现在出棋的一方： 0 代表白方, 1代表黑方
      currentUser: 0,

      // 当前选中棋子的可走路径
      currentAvailablePaths: [],

      // 当前选中棋子的可能终点
      currentAvailableDst: [],

      // 悔棋数据
      withdraw: [{ "W": movegen.fill50(1048575), "B": movegen.fill50(1125898833100800), "K": movegen.fill50(0) }],

      // 小程序棋盘索引转换成bitboard棋盘索引
      mini2Bit: [null, 45, null, 46, null, 47, null, 48, null, 49,
        40, null, 41, null, 42, null, 43, null, 44, null,
        null, 35, null, 36, null, 37, null, 38, null, 39,
        30, null, 31, null, 32, null, 33, null, 34, null,
        null, 25, null, 26, null, 27, null, 28, null, 29,
        20, null, 21, null, 22, null, 23, null, 24, null,
        null, 15, null, 16, null, 17, null, 18, null, 19,
        10, null, 11, null, 12, null, 13, null, 14, null,
        null, 5, null, 6, null, 7, null, 8, null, 9,
        0, null, 1, null, 2, null, 3, null, 4, null],

      // bitboard棋盘索引转换成小程序棋盘索引
      bit2Mini: [90, 92, 94, 96, 98,
        81, 83, 85, 87, 89,
        70, 72, 74, 76, 78,
        61, 63, 65, 67, 69,
        50, 52, 54, 56, 58,
        41, 43, 45, 47, 49,
        30, 32, 34, 36, 38,
        21, 23, 25, 27, 29,
        10, 12, 14, 16, 18,
        1, 3, 5, 7, 9],

      // 转换成Scan的棋盘索引
      mini2Scan: [null, 1, null, 2, null, 3, null, 4, null, 5,
        6, null, 7, null, 8, null, 9, null, 10, null,
        null, 11, null, 12, null, 13, null, 14, null, 15,
        16, null, 17, null, 18, null, 19, null, 20, null,
        null, 21, null, 22, null, 23, null, 24, null, 25,
        26, null, 27, null, 28, null, 29, null, 30, null,
        null, 31, null, 32, null, 33, null, 34, null, 35,
        36, null, 37, null, 38, null, 39, null, 40, null,
        null, 41, null, 42, null, 43, null, 44, null, 45,
        46, null, 47, null, 48, null, 49, null, 50, null],

      client: 0
    });
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 游戏结束后，用户决定退出当前页面，返回上一级
  exit:function() {
    // 先告诉服务器用户退出当前桌子
    const table_info = {
      "BigRoomId":this.data.table_info
    }
    console.log(table_info);
    this.data.client.publish("Jump/HD_Exit",JSON.stringify(table_info), console.log);
    // 再返回上一页
    var pages = getCurrentPages(); //当前页面
    var beforePage = pages[pages.length - 2]; //前一页
    wx.navigateBack({
      success: function () {
        beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },
  
  // 再来一局
  again:function() {
    this.initialize();
    this.onLoad();
  },

  // 将本次对局数据保存到服务器，如成功，则本按钮灰显，如失败，则本按钮还能继续按
  collect: function (result) {
    // 发送checker_color至服务器
    const checker_color = {
      "checker_color": this.data.checker_color
    };
    this.data.client.publish("Jump/HD_Collect", JSON.stringify(checker_color), console.log);
  },

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    /*
    var that = this;
    wx.showModal({
      title: "您确定要离开吗？",
      content: "离开房间将会导致您本局游戏判负",
      confirmText: "确定",   
      confirmColor: "skyblue",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "black",

      success: function (res) {
        if (res.cancel) { // 继续留在房间
        } else { // 依旧离开房间
          const table_info = {
            "BigRoomId":that.data.table_info
          }
          console.log(table_info);
          that.data.client.publish("Jump/HD_Exit",JSON.stringify(table_info), console.log);
        }      
      }
    })
    */
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