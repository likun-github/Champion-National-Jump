// pages/conpetition/competitionindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    innerNavigation: "registe",


// CompetitionDesc: "ASDASD"
// CompetitionId: "0"
// CompetitionName: "AASDASD"
// CompetitionSignUpFinished: false
// CompetittionFinished: false
// ConstitutionId: "1"
//gx_md5_hash: "A462698D99BB1D0CFD961B523E87C06F"
    registingCompetitions: [{ name: "比赛名称", constitution: "云顶工坊" },{ name: "比赛名称", constitution: "云顶工坊" }],
    greatCompetitions: [{ name: "超级比赛", constitution: "云顶工坊" }, { name: "青年棋手", constitution: "云顶工坊" }],
    myCompetitions: [{name:"比赛名称",constitution:"云顶工坊"}]

  },
  redict: function (e) {
    var app = getApp();
    app.redict(e);

  },

  GoToEdCompetition: function(){

    wx.navigateTo({
      url: './edcompetition',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  GoToCompetitionInfo: function(e){
    


    wx.navigateTo({
      url: '/pages/conpetition/competitioninfo?id=' + e.currentTarget.dataset.competitionid,
    });

  },
  ChangeInnerNavigation: function(e){

    var that = this;

    var navigation = e.currentTarget.dataset.navigation;
    
    that.setData({innerNavigation:navigation});

  },

  onLoad: function (options) {
    var that = this;
    // 获取目前的竞赛
    wx.request({
      url: 'http://localhost:8082/StayHomeRestServer.NETCoreEnvironment/rest/GetCompetitions',
      data:JSON.stringify({pageIndex:1,pageSize:10}),
      success: function(res){

        console.log(res.data.competitions)
        that.setData({registingCompetitions:res.data.competitions});

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