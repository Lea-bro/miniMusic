// baseui/bav-bar/index.js
import {NavBarHeight} from '../../constants/device-const';

Component({
  options:{
    multipleSlots:true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:"默认标题"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight:0,
    NavBarHeight:0
  },

  lifetimes:{
    attached(){
      const statusBarHeight = getApp().globalData.statusBarHeight
      this.setData({statusBarHeight})
      this.setData({NavBarHeight})
    }
  },
  methods: {
    handleBackPageClick:function (params) {
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})
