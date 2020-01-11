// pages/chessmanual/chessmanualindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lh:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQuODQxIiBoZWlnaHQ9Ijc4LjI1MiIgdmlld0JveD0iMCAwIDY0Ljg0MSA3OC4yNTIiPgogIDxkZWZzPgogICAgPGZpbHRlciBpZD0i5qSt5ZyGXzE0MCIgeD0iMCIgeT0iMzkuMzkyIiB3aWR0aD0iNTUuNTA3IiBoZWlnaHQ9IjM4Ljg2IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8ZmVPZmZzZXQgZHk9IjMiIGlucHV0PSJTb3VyY2VBbHBoYSIvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIzIiByZXN1bHQ9ImJsdXIiLz4KICAgICAgPGZlRmxvb2QgZmxvb2QtY29sb3I9IiM4ODgiIGZsb29kLW9wYWNpdHk9IjAuNiIvPgogICAgICA8ZmVDb21wb3NpdGUgb3BlcmF0b3I9ImluIiBpbjI9ImJsdXIiLz4KICAgICAgPGZlQ29tcG9zaXRlIGluPSJTb3VyY2VHcmFwaGljIi8+CiAgICA8L2ZpbHRlcj4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoIj4KICAgICAgPHBhdGggaWQ9IuiBlOWQiF80IiBkYXRhLW5hbWU9IuiBlOWQiCA0IiBkPSJNMCwyNy4wMDhWMEgxOC45ODJWMjcuMDA4WiIgZmlsbD0ibm9uZSIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CiAgPGcgaWQ9IuacgOWQjuS4gOmdouaXl+WtkCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTkzOSAxMDc0MikiPgogICAgPGcgaWQ9Iue7hOS7tl82MF8xMSIgZGF0YS1uYW1lPSLnu4Tku7YgNjAg4oCTIDExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTkzMCAtMTA2OTYuNjA4KSI+CiAgICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC05LCAtNDUuMzkpIiBmaWx0ZXI9InVybCgj5qSt5ZyGXzE0MCkiPgogICAgICAgIDxnIGlkPSLmpK3lnIZfMTQwLTIiIGRhdGEtbmFtZT0i5qSt5ZyGIDE0MCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOSA0NS4zOSkiIGZpbGw9IiNjOGM4YzgiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIzIj4KICAgICAgICAgIDxlbGxpcHNlIGN4PSIxOC43NTQiIGN5PSIxMC40MyIgcng9IjE4Ljc1NCIgcnk9IjEwLjQzIiBzdHJva2U9Im5vbmUiLz4KICAgICAgICAgIDxlbGxpcHNlIGN4PSIxOC43NTQiIGN5PSIxMC40MyIgcng9IjE3LjI1NCIgcnk9IjguOTMiIGZpbGw9Im5vbmUiLz4KICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgIDwvZz4KICAgIDxnIGlkPSJmbGFnIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTkxNCAtMTA3NDIpIj4KICAgICAgPHJlY3QgaWQ9ImxpbmUiIHdpZHRoPSIzLjMzNSIgaGVpZ2h0PSI1NC4wMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSIgZmlsbD0iIzMyNGQ1YiIvPgogICAgICA8ZyBpZD0icmVkX2JhY2siIGRhdGEtbmFtZT0icmVkIGJhY2siIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwLjg1OCA0LjI2NSkiPgogICAgICAgIDxnIGlkPSJyZWRfYmFjay0yIiBkYXRhLW5hbWU9InJlZCBiYWNrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDApIj4KICAgICAgICAgIDxyZWN0IGlkPSJyZWRfYmFjay0zIiBkYXRhLW5hbWU9InJlZCBiYWNrIiB3aWR0aD0iMTguOTgyIiBoZWlnaHQ9IjI3LjAwOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCkiIGZpbGw9IiNlMjU3NGMiLz4KICAgICAgICAgIDxwYXRoIGlkPSJDb2xvcl9PdmVybGF5IiBkYXRhLW5hbWU9IkNvbG9yIE92ZXJsYXkiIGQ9Ik0wLDBIMTguOTgyVjI3LjAwOEgwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCkiIG9wYWNpdHk9IjAuMSIvPgogICAgICAgIDwvZz4KICAgICAgICA8ZyBpZD0iQ2xpcCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtcGF0aCkiPgogICAgICAgICAgPHBhdGggaWQ9InllbGxvd19iYWNrIiBkYXRhLW5hbWU9InllbGxvdyBiYWNrIiBkPSJNMCwyNy4wMDhWMjIuNzQzSDE4Ljk4MnY0LjI2NVpNNC4zOCw0LjI2NFYwaDE0LjZWNC4yNjRaIiBmaWxsPSIjZjFjZDZlIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGlkPSJjb3JuZXIiIGQ9Ik00NjIuMjcsNTg5LjQyOWg0LjM4bC00LjM4LDQuMjY1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ0MS40MTEgLTU2Mi40MjEpIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMjUpIi8+CiAgICAgIDxwYXRoIGlkPSJyZWRfZnJvbnQiIGRhdGEtbmFtZT0icmVkIGZyb250IiBkPSJNMCwwSDIxLjlWMjcuMDA4SDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjMzNiAwKSIgZmlsbD0iI2UyNTc0YyIvPgogICAgICA8cGF0aCBpZD0ieWVsbG93X2Zyb250IiBkYXRhLW5hbWU9InllbGxvdyBmcm9udCIgZD0iTTAsMjcuMDA4VjIyLjc0NEgyMS45djQuMjY0Wk0wLDQuMjY1VjBIMjEuOVY0LjI2NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuMzM2KSIgZmlsbD0iI2YxY2Q2ZSIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==',
    lhui:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTUuNTA4IiBoZWlnaHQ9IjgwLjI1MiIgdmlld0JveD0iMCAwIDU1LjUwOCA4MC4yNTIiPgogIDxkZWZzPgogICAgPGZpbHRlciBpZD0i5qSt5ZyGXzE0MCIgeD0iMCIgeT0iNDEuMzkxIiB3aWR0aD0iNTUuNTA4IiBoZWlnaHQ9IjM4Ljg2MSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPGZlT2Zmc2V0IGR5PSIzIiBpbnB1dD0iU291cmNlQWxwaGEiLz4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMyIgcmVzdWx0PSJibHVyIi8+CiAgICAgIDxmZUZsb29kIGZsb29kLWNvbG9yPSIjODg4IiBmbG9vZC1vcGFjaXR5PSIwLjYiLz4KICAgICAgPGZlQ29tcG9zaXRlIG9wZXJhdG9yPSJpbiIgaW4yPSJibHVyIi8+CiAgICAgIDxmZUNvbXBvc2l0ZSBpbj0iU291cmNlR3JhcGhpYyIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGlkPSLnu4Tku7ZfNjBfMyIgZGF0YS1uYW1lPSLnu4Tku7YgNjAg4oCTIDMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkpIj4KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIC05LCAwKSIgZmlsdGVyPSJ1cmwoI+akreWchl8xNDApIj4KICAgICAgPGcgaWQ9IuakreWchl8xNDAtMiIgZGF0YS1uYW1lPSLmpK3lnIYgMTQwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5IDQ3LjM5KSIgZmlsbD0iI2M4YzhjOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjMiPgogICAgICAgIDxlbGxpcHNlIGN4PSIxOC43NTQiIGN5PSIxMC40MyIgcng9IjE4Ljc1NCIgcnk9IjEwLjQzIiBzdHJva2U9Im5vbmUiLz4KICAgICAgICA8ZWxsaXBzZSBjeD0iMTguNzU0IiBjeT0iMTAuNDMiIHJ4PSIxNy4yNTQiIHJ5PSI4LjkzIiBmaWxsPSJub25lIi8+CiAgICAgIDwvZz4KICAgIDwvZz4KICAgIDxnIGlkPSLml5ciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2LjI2KSI+CiAgICAgIDxyZWN0IGlkPSLnn6nlvaJfNTkyIiBkYXRhLW5hbWU9IuefqeW9oiA1OTIiIHdpZHRoPSIzLjA0IiBoZWlnaHQ9IjU2LjEzNSIgZmlsbD0iIzk2NTAyOCIvPgogICAgICA8cGF0aCBpZD0i6Lev5b6EXzc5MyIgZGF0YS1uYW1lPSLot6/lvoQgNzkzIiBkPSJNMy4wNCwxMDAuMTY3LDAsOTkuMTd2MTguOTQ4bDMuMDQtMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTk0Ljk2NCkiIGZpbGw9IiM4MjMyMTQiLz4KICAgICAgPHBhdGggaWQ9Iui3r+W+hF83OTQiIGRhdGEtbmFtZT0i6Lev5b6EIDc5NCIgZD0iTTAsNjYuMTEzVjM5LjczTDI4Ljg4NSw1Mi45MjJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0zOC4wNDUpIiBmaWxsPSIjZmY0ODM5Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K',
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
    var serverRoot = getApp().globalData.ServerRoot;
    this.setData({ serverRoot: serverRoot });
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