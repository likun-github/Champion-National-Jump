// pages/chessmanual/pass.js

var movegen = require('../../utils/movegen.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: "",

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var serverRoot = getApp().globalData.ServerRoot;
    this.setData({ serverRoot: serverRoot });

    var context = wx.createCanvasContext('chessboard');
    this.setData({ context: context });

    this.Inite();

    context.draw();
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
        context.drawImage(this.data.serverRoot +"/img/bm.svg", center.x - width / 2 + width / 8, center.y - width / 2 + width / 8, width * 6 / 8, width * 6 / 8);
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
        context.drawImage(this.data.serverRoot+"/img/wm.svg", center.x - width / 2 + width / 8, center.y - width / 2 + width / 8, width * 6 / 8, width * 6 / 8);
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


  // 获取中心点坐标
  GetRectCenter(col, row, width, height) {
    return { x: width / 10 / 2 + row * width / 10, y: height / 10 / 2 + col * height / 10 }
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