// pages/conpetition/competitionindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    innerNavigation: "registe",
    registingCompetitions: [{ name: "比赛名称", constitution: "云顶工坊" },{ name: "比赛名称", constitution: "云顶工坊" }],
    greatCompetitions: [{ name: "超级比赛", constitution: "云顶工坊" }, { name: "青年棋手", constitution: "云顶工坊" }],
    myCompetitions: [{name:"比赛名称",constitution:"云顶工坊"}],

//记录目前页数
    registeIndex:1,
    greatIndex:1,
    myIndex:1


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



  GetRegistingCompetitions: function(index){
    var app = getApp();
    var serverUrl = app.globalData.restServiceBaseUrl;


    // 获取目前的竞赛
    wx.request({
      url: serverUrl + "GetRegistingCompetitions?pageIndex="+index,
      success: function (res) {
        that.setData({ registingCompetitions: res.data.competitions });
      }
    })
  },
  GetGreatCompetitions: function (index) {
    var app = getApp();
    var serverUrl = app.globalData.restServiceBaseUrl;


    // 获取目前的竞赛
    wx.request({
      url: serverUrl + "GetGreatCompetitions?pageIndex=" + index,
      success: function (res) {
        that.setData({ greatCompetitions: res.data.competitions });
      }
    })
  },
  GetMyCompetitions: function (index) {
    var app = getApp();
    var serverUrl = app.globalData.restServiceBaseUrl;


    // 获取目前的竞赛
    wx.request({
      url: serverUrl + "GetMyCompetitions?pageIndex=" + index,
      success: function (res) {
        that.setData({ myCompetitions: res.data.competitions });
      }
    })
  },

  

  onLoad: function (options) {
    var that = this;
    
    //等待后端接口

    //that.GetRegistingCompetitions(1);
    //that.GetGreatCompetitions(1);
    //that.GetMyCompetitions(1);
  },

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    var that = this;

    if (that.data.innerNavigation == "registe"){
        let indexNow = that.data.registeIndex + 1
        that.setData({registeIndex:indexNow});
        that.GetRegistingCompetitions(indexNow)
    }
    else if (that.data.innerNavigation == "my"){
      let indexNow = that.data.myIndex + 1
      that.setData({ myIndex: indexNow });
      that.GetMyCompetitions(indexNow)

    }
    else if(that.data.innerNavigation == "great"){
      let indexNow = that.data.greatIndex + 1
      that.setData({ greatIndex: indexNow });
      that.GetGreatCompetitions(indexNow)
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