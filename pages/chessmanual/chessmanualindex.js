// pages/chessmanual/chessmanualindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      innerRoute: "tree",
      sortMethod: "all",
      practices:[
        {id:'1',name:'哈啊哈哈',coverPath:'',viewCount:100,thumbCount:100,username:"孙教练"},
        { id: '1',name:'是的啊', coverPath: '', viewCount: 100, thumbCount: 100, username: "孙教练" },
        { id: '1',name:'我不知', coverPath: '', viewCount: 100, thumbCount: 100, username: "孙教练" },
        { id: '1',name:'对的', coverPath: '', viewCount: 100, thumbCount: 100, username: "孙教练" }
        ],
      competitions:[


      ],
      practicePageIndex:1,
      competitionPageIndex:1
  },

  redict: function (e) {
    var app = getApp();
    app.redict(e);

  },
  GoToDetail: function(){


    wx.navigateTo({
      url: '/pages/mycollection/competitiondetail',
    })
  },

  ChangeRoute: function (e) {

    this.setData({
      innerRoute: e.currentTarget.dataset.route
    })

  },
  GoToPractise: function(){
    wx.navigateTo({
      url: '/pages/mycollection/practise',
    })

  },

  changeSortMethod: function(e){

    var that = this;
    that.setData({sortMethod:e.currentTarget.dataset.method})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getPractices: function(){
    var app = getApp();
    var serverUrl = app.globalData.restServiceBaseUrl;
    var that = this;

    // 获取目前的竞赛
    wx.request({
      url: serverUrl + "GetPractices?pageIndex=" + that.practicePageIndex,
      success: function (res) {
        var practices = res.data.practices;

        if(that.practices.length==0){
          that.setData({ practices: practices });
        }
        else{
          for(let i=0;i<practices.length;i++){
            that.practices.push(practices[i]);
          }
          that.setData({practices: that.practices});
        }
      }
    })

  },
  getCompetitions: function () {
    var app = getApp();
    var serverUrl = app.globalData.restServiceBaseUrl;
    var that = this;

    // 获取目前的竞赛
    wx.request({
      url: serverUrl + "GetClassicGame?pageIndex=" + that.competitionPageIndex,
      success: function (res) {
        var competitions = res.data.games;

        if (that.competitions.length == 0) {
          that.setData({ competitions: competitions });
        }
        else {
          for (let i = 0; i < competitions.length; i++) {
            that.practices.push(competitions[i]);
          }
          that.setData({ competitions: that.competitions });
        }
      }
    })

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