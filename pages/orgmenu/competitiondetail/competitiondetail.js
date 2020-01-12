// pages/orgmenu/mycollections/competitiondetail.js

var movegen = require('../../../utils/movegen.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverRoot: "",
    
    // 上下文
    context: null,

    //canvas相关变量：canvas的长宽，和画图笔
    chessBoardWidth: wx.getSystemInfoSync().windowWidth * (750 - 30/*margin*/ * 4) / (750) - 15 * 2,
    chessBoardHeight: wx.getSystemInfoSync().windowWidth * (750 - 30/*margin*/ * 4) / (750) - 15 * 2,

    // 棋数据
    blackChesses: [],
    whiteChesses: [],
    kingChesses: [],

    // 当前走棋方
    currentUser: 0,

    // 棋局数据
    collection: null,
    currentBoardIndex: 0,

    // 最大走棋数
    maxMoves: 0,

    // 游戏结果
    result: null,

    // 模式
    mode: 0 /*手动模式*/,

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
      1, 3, 5, 7, 9]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置服务器路径
    var serverRoot = getApp().globalData.ServerRoot;
    this.setData({ serverRoot: serverRoot });

    // 获取上一个页面的数据
    let pages = getCurrentPages();
    let previousPage = pages[pages.length - 2];
    this.setData({ result: previousPage.data.currentCollection["result"] });
    let collection = [];
    for (let i = 0; i < previousPage.data.currentCollection["white"].length; i++) {
      collection.push(previousPage.data.currentCollection["white"][i]);
      if (previousPage.data.currentCollection["black"][i] != undefined) {
        collection.push(previousPage.data.currentCollection["black"][i]);
      }

    }
    this.setData({ collection: collection });
    this.setData({ maxMoves: collection.length - 1 });


    // 初始化棋盘
    var context = wx.createCanvasContext('chessboard');
    this.setData({ context: context });
    this.Inite();
    context.draw();
  },

  // 初始化棋盘
  Inite: function () {
    // 初始化棋盘-清空棋子
    this.clearBoard();

    // 初始化棋盘-填棋
    this.Bitboard2Miniboard(this.data.collection[this.data.currentBoardIndex]);

    // 绘制棋盘
    this.DrawBoard();
    this.DrawChesses();
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

  // 画棋盘
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
  },

  // 获取中心点坐标
  GetRectCenter(col, row, width, height) {
    return { x: width / 10 / 2 + row * width / 10, y: height / 10 / 2 + col * height / 10 }
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
        this.DrawChess(i, context)
      }
    }
    context.closePath();
    context.setFillStyle("black");
    context.fill();

    context.beginPath();
    // 画白色棋
    for (let i = 0; i < this.data.whiteChesses.length; i++) {
      if (this.data.whiteChesses[i] == 1) {
        this.DrawChess(i, context)
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
        context.drawImage("/img/king.png", center.x - width / 2, center.y - width / 2, width, width);
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

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // 回到初始棋位
  toFirstStep: function () {
    this.setData({ currentBoardIndex: 0 });
    this.Inite();
    this.data.context.draw();
  },

  // 上一步
  lastStep: function () {
    if (this.data.currentBoardIndex == 0) { // 初始局面，无法进行上一步
      wx.showModal({
        title: "提示",
        content: "还未走棋，无法回到上一步！",
        confirmText: "确定",
        showCancel: false
      })
    } else {
      this.setData({ currentBoardIndex: this.data.currentBoardIndex - 1 });
      this.Inite();
      this.data.context.draw();
    }
  },

  // 下一步
  nextStep: function () {
    if (this.data.currentBoardIndex == this.data.maxMoves) { // 到达最后一步
      wx.showModal({
        title: "提示",
        content: "已经下完啦！",
        confirmText: "确定",
        showCancel: false
      })
    } else {
      this.setData({ currentBoardIndex: this.data.currentBoardIndex + 1 });
      this.Inite();
      this.data.context.draw();
    }
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////

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