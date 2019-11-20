// pages/game/aicompetition.js

var movegen = require('../../utils/movegen.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 上下文
    context: null,
    
    //canvas相关变量：canvas的长宽，和画图笔
    chessBoardWidth: wx.getSystemInfoSync().windowWidth - 2,
    chessBoardHeight: wx.getSystemInfoSync().windowWidth - 2,

    // 棋数据
    blackChesses: [],
    whiteChesses: [],
    kingChesses: [],

    // 游戏结果
    gameResult: "",

    // 游戏结束
    gameEnd: false,

    //现在的目前对象
    currentTarget: null,

    //代表现在出棋的一方： 0 代表白方, 1代表黑方（AI）
    currentUser: 0,

    // 当前选中棋子的可走路径
    currentAvailablePaths: [],

    // 当前选中棋子的可能终点
    currentAvailableDst: [],

    // 转换成Scan的棋盘索引
    toScanBoard: [null, 1, null, 2, null, 3, null, 4, null, 5, 6, null, 7, null, 8, null, 9, null, 10, null, null, 11, null, 12, null, 13, null, 14, null, 15, 16, null, 17, null, 18, null, 19, null, 20, null, null, 21, null, 22, null, 23, null, 24, null, 25, 26, null, 27, null, 28, null, 29, null, 30, null, null, 31, null, 32, null, 33, null, 34, null, 35, 36, null, 37, null, 38, null, 39, null, 40, null, null, 41, null, 42, null, 43, null, 44, null, 45, 46, null, 47, null, 48, null, 49, null, 50, null]
  },










  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var context = wx.createCanvasContext('chessboard');
    this.setData({ context: context });

    this.Inite();
    context.draw(); 
  },

  // 初始化棋盘数据
  Inite: function () {
    //this.data.context.clearRect(0, 0, this.data.width, this.data.height);

    // 初始化棋盘数据
    this.data.whiteChesses = [];
    this.data.blackChesses = [];
    this.data.kingChesses = [];

    for (let i = 0; i < 100; i++) {
      if (i <= 39 && (Math.floor(i / 10) + i) % 2 == 1) {
        this.data.blackChesses.push(1);
      } else {
        this.data.blackChesses.push(0);
      }

      if (i >= 60 && (Math.floor(i / 10) + i) % 2 == 1) {
        this.data.whiteChesses.push(1);
      } else {
        this.data.whiteChesses.push(0);
      }

      this.data.kingChesses.push(0);
    }

    this.DrawBoard();
    this.DrawChesses();
  },

  // 画棋盘
  DrawBoard: function () {
    var width = this.data.chessBoardWidth
    var height = this.data.chessBoardHeight
    var context = this.data.context;
    context.setFillStyle("rgb(156, 214, 228)");
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
        context.drawImage("/images/king.png", center.x - width / 2, center.y - width / 2, width, width);
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

    // return [Math.floor(x / (width / 10)), Math.floor(y / (height / 10))]
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 点击棋盘事件
  TapBoard: function (e) {
    // 获取当前点击位置在画布上的坐标
    var x = e.detail.x - e.currentTarget.offsetLeft;
    var y = e.detail.y - e.currentTarget.offsetTop;

    // 获取点击的格子的index
    var targetRect = this.GetTargetRect(x, y);

    // 获取当前 所有的 可走路径
    let paths = [];
  
    paths = this.GetAvailablePaths(this.data.currentUser);
    if (paths.length == 0) { // 当前方无子可走,弹出游戏结束对话框
      this.setData({ gameEnd: true });
      if (this.data.currentUser == 0) {
        this.setData({ gameResult: "您输了！" });
      } else {
        this.setData({ gameResult: "您赢了！" });
      }
    }

    // 白棋（用户）走棋
    if (this.data.currentUser == 0 ) {
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
        // 把当前棋盘转换成Scan的棋盘，并上传服务器………………
      }
    }
    
  },
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 游戏结束，取消按钮
  endGame:function() {
    wx.navigateTo({
      url: './game',
    });
  },


  // 认输，回到上一个界面
  giveUp: function () {
    wx.navigateTo({
      url: './game',
    });
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