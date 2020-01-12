// pages/game/fastcompetition.js

var movegen = require('../../../utils/movegen.js');
var util = require('../../../utils/util.js');
var mqtt = require('../../../lab/mqtt.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    l:-1000,
    wm:'/static/wm.png',
    bm:'/static/bm.png',
    serverRoot: "",
    item:'',
    // 对手信息
    opponentID:null,
    opponentName:null,
    opponentLevel:null,
    opponentScore:null,

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

    // 悔棋次数
    withdrawSend:0, /*0：用户未点击 悔棋；1：用户点击 悔棋 */
    withdrawReceive:0, /*0：对手未点击 悔棋； 1：对手点击 悔棋 */
    withdrawNum:3, /*剩余悔棋次数 */
    withdrawResult:-1, /*-1：未收到对手是否同意悔棋；0：不同意；1：同意 */


    // 游戏结果
    gameResult: -1,  /*-1：未出结果；0：胜； 1：负； 2：和*/

    //现在的目前对象
    currentTarget: null,

    //代表现在出棋的一方： 0 代表白方, 1代表黑方（AI）
    currentUser: 0,

    // 当前选中棋子的可走路径
    currentAvailablePaths: [],

    // 当前选中棋子的可能终点
    currentAvailableDst: [],

    // 悔棋数据
    whiteWithdraw: [{ "W": movegen.fill50(1048575), "B": movegen.fill50(1125898833100800), "K": movegen.fill50(0) }],
    blackWithdraw: [],

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
      46, null, 47, null, 48, null, 49, null, 50, null]
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

    const client = mqtt.connect('wx://192.168.5.19:3654');
    var userid = getApp().globalData.userId;
    const match_options = {
      "userid":userid
    }
    client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    });
    client.on('error', (error) => {
      console.log('连接失败:', error)
    });
    client.on('connect', (e) => {
      console.log('成功连接服务器!')
      client.publish("Jump/HD_Match",  JSON.stringify(match_options), console.log)
      client.subscribe('oppoInfo' + 1, { qos: 2 }, function (err) {
        if (!err) {
          console.log("订阅成功")
        }
      })
    })

    setTimeout(() => {
      this.setData({
        opponentID:1
      })
    }, 5000);
    setTimeout(() => {
      this.setData({
        gameResult:1
      })
    }, 10000);
    // 设置服务器路径
    var serverRoot = getApp().globalData.ServerRoot;
    this.setData({ serverRoot: serverRoot });

    var context = wx.createCanvasContext('chessboard');
    this.setData({ context: context });

    this.Inite();

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
    this.startTimer();
    
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

    // 白棋（用户）走棋
    if (this.data.currentUser == 0) {
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
        // 更改棋盘-更改白棋数组
        this.data.whiteChesses[src] = 0;
        this.data.whiteChesses[dst] = 1;
        // 更改棋盘-如果是移动的是王棋，则更改王棋数组
        if (this.data.kingChesses[src] == 1) {
          this.data.kingChesses[src] = 0;
          this.data.kingChesses[dst] = 1;
        }
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
        // 更改棋盘-绘制白棋起点、终点
        this.HighlightChess(src, "red");
        this.HighlightChess(dst, "red");
        // 更改棋盘-绘制所有棋子
        this.DrawChesses();
        this.data.context.draw();

        // 更换当前走子方
        this.setData({ currentUser: 1 });
        // 清空当前选中棋子信息
        this.setData({ currentTarget: null, availablePaths: null });
        // 把当前棋盘转换成bitboard棋盘，存在whiteWithdraw中
        this.data.whiteWithdraw.push(this.MiniBoard2Bitboard());
        // 把当前棋盘转换成Scan的棋盘，并上传服务器………………

        // 开启计时器
        this.startTimer();
      }
    } else { // 黑棋（AI）走棋


      
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
  // 更改棋盘-更改黑棋数组
  this.data.blackChesses[src] = 0;
  this.data.blackChesses[dst] = 1;
  // 更改棋盘-如果是移动的是王棋，则更改王棋数组
  if (this.data.kingChesses[src] == 1) {
    this.data.kingChesses[src] = 0;
    this.data.kingChesses[dst] = 1;
  }
  // 更改棋盘-如果黑棋到达顶部则变为王棋
  if (Math.floor(dst / 10) == 0) {
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
  // 更改棋盘-绘制白棋起点、终点
  this.HighlightChess(src, "red");
  this.HighlightChess(dst, "red");
  // 更改棋盘-绘制所有棋子
  this.DrawChesses();
  this.data.context.draw();

  // 更换当前走子方
  this.setData({ currentUser: 0 });
  // 清空当前选中棋子信息
  this.setData({ currentTarget: null, availablePaths: null });
  // 把当前棋盘转换成bitboard棋盘，存在whiteWithdraw中
  this.data.whiteWithdraw.push(this.MiniBoard2Bitboard());
  // 把当前棋盘转换成Scan的棋盘，并上传服务器………………

  // 开启计时器
  this.startTimer();


      }
    }
  },
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 认输
  lose: function () {
  },

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

  // 悔棋，白方退一步棋
  withdraw: function () {
    if (this.data.whiteWithdraw.length == 1) { // 刚刚开局，不能悔棋
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "你还没走棋，不能悔棋！",
      })
    } else { // 可以悔棋
      if (this.data.whiteWithdraw.length-1 == this.data.blackWithdraw.length) { // 白棋走后黑棋已走，先悔黑棋，再悔白棋
        this.data.blackWithdraw.pop();
      } else if (this.data.whiteWithdraw.length - 2 == this.data.blackWithdraw.length) { // 白棋走后黑棋未走，只悔白棋，但要跟服务器发请求让别再走黑棋了
        this.data.whiteWithdraw.pop();
        // 给服务器发请求让别走黑棋………………
      } else {
        console.log("bug!");
      }
      let currentBitboard = this.data.whiteWithdraw.pop();
      this.Bitboard2Miniboard(currentBitboard);
      this.data.whiteWithdraw.push(currentBitboard);
      // 重新绘制棋盘
      this.DrawBoard();
      this.DrawChesses();
      this.data.context.draw();
      // 悔棋后走白棋
      this.setData({ currentUser: 0 });
      this.startTimer();
    }

  },

  // 将本次对局数据保存到本地
  collect: function (result) {
    wx.setStorage({
      key: util.formatTime(Date.now()).toString(),   // key为时间
      data: {
        "type": "人机对战",
        "white": this.data.whiteWithdraw,
        "black": this.data.blackWithdraw,
        "result": result
      }
    })
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