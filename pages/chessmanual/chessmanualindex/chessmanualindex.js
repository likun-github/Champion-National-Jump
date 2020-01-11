// pages/chessmanual/chessmanualindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      serverRoot: "",
      scroll_view_height: (wx.getSystemInfoSync().windowHeight * (750 / wx.getSystemInfoSync().windowWidth) ),
      background_height_rpx:750/1024*2668,
      pass_pos_info:[
        { height_ratio: 0.04, width_ratio: 0.44, id: 10, state: 0, tag_height_ratio:0.105 ,tag_width_ratio:0.41},
        { height_ratio: 0.10, width_ratio: 0.11, id: 9, state: 0, tag_height_ratio: 0.175, tag_width_ratio: 0.09 },
        { height_ratio: 0.25, width_ratio: 0.34, id: 8, state: 0, tag_height_ratio: 0.27, tag_width_ratio: 0.48 },
        { height_ratio: 0.32, width_ratio: 0.65, id: 7, state: 0, tag_height_ratio: 0.35, tag_width_ratio: 0.48 },
        { height_ratio: 0.41, width_ratio: 0.71, id: 6, state: 0, tag_height_ratio: 0.44, tag_width_ratio: 0.53 },
        { height_ratio: 0.53, width_ratio: 0.84, id: 5, state: 0, tag_height_ratio: 0.54, tag_width_ratio: 0.70 },
        { height_ratio: 0.54, width_ratio: 0.49, id: 4, state: 0, tag_height_ratio: 0.615, tag_width_ratio: 0.46 },
        { height_ratio: 0.61, width_ratio: 0.15, id: 3, state: 0, tag_height_ratio: 0.685, tag_width_ratio: 0.13 },
        { height_ratio: 0.69, width_ratio: 0.59, id: 2, state: 1, tag_height_ratio: 0.715, tag_width_ratio: 0.715 },
        { height_ratio: 0.82, width_ratio: 0.20, id: 1, state: 2, tag_height_ratio: 0.855, tag_width_ratio: 0.35 }
        ],
      numPass:10,  
      passSelected:0,
      currentPass:"pass-9",
      pass_detail:[]
  },

  redict: function (e) {
    var app = getApp();
    app.redict(e);

  },

  goToPass:function(e) {
    console.log(e.currentTarget);
    // 获取选中pass的id
    var pass_id = parseInt(e.currentTarget.id.slice(5, e.currentTarget.id.length));
    
    this.setData({ passSelected: pass_id});
    if (this.data.pass_pos_info[pass_id].state != 0) {
      wx.navigateTo({
        url: '../pass/pass',
      })
    } else {
      wx.showModal({
        content: '该关卡暂未开放，敬请期待！',
        showCancel: false,
        confirmText: "我知道了",
        confirmColor: 'skyblue',//确定文字的颜色
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var serverRoot = getApp().globalData.localhost;
    this.setData({ serverRoot: serverRoot });
    var procedure = "";
    // 
    var that = this;
    wx.request({
      url: "http://127.0.0.1:8081/ChessManual",
      data: { "passid": 1},
      success: function (res) {
        that.setData({pass_detail:res.data});
        console.log(res.data);
      }
    });
    
  },

  onPullDownRefresh: function () {
    var that = this;

    if (that.innerRoute == "train"){
      that.setData("practicePageIndex", ++that.practicePageIndex);
      that.getPractices();
    }
    else if(that.innerRoute == "competition")
    {
      that.setData("practicePageIndex", ++that.competitionPageIndex);
      that.getCompetitions();
    }

    
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