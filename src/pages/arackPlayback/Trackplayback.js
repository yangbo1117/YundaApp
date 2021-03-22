import React, { Component } from "react"
import axios from '../../axios'
import ReactTooltip from "react-tooltip"
import './arackplay.scss'
import { Form,Row,Col,Button,Icon,Select,Modal,Input,Spin,DatePicker,TimePicker,Slider } from 'antd';
import moment from 'moment';
import $ from "jquery"
let mappGD;
let datat
let listNoMarket = [];//未标记点
let listMarket = [];//已标记点
let points = []
let lineArr = [];
let marker
let passedPolyline
let ridingOption = {
    policy: 1  
};
let riding = new window.AMap.Riding(ridingOption)
let routePointsJson = {};//导航点
let icon = new window.AMap.Icon({
    size: new window.AMap.Size(53, 68),
    image: 'http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
    imageSize: new window.AMap.Size(20, 20),
});
const { Option } = Select
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
class TrPlayback extends React.Component{  
    constructor(props){
        super(props);
        this.state = {
            value:"",
            isshow:true,//控制卡片
            addressList:[],//选择的网点
            personList:[],//网点下的业务员
            data:"",//票见的日期
            startTime:"",//开始的时间
            endTime:"",//结束的时间
            signTime:"",
            dealmanId:"",//业务员编码
            branchId:"", //网点编码
            dateTime:'all', //查询日期，all查全部
            mapType:'gaode',
            startTimee:"",
            speed:500,
        }
    }

confirm(){
    Modal.confirm({
      title: '系统提示',
      content: '请输入关键词搜索',
      okText: '确认',
      cancelText: '取消',
      mask:false,
      zIndex:111111111111111111,
      centered:true,
    });
  }

close(){
this.setState({
    isshow:false
})
}

show(){
    this.setState({
        isshow:true
    })
}
 //选择网点
 onChange(value){
   
    console.log(`selected ${value}`);
    let branchobj =  this.state.addressList.filter((item)=>{
        if(item.value===value){
            return item
        }
    })
  this.setState({
     branchId:value,
     dealmanId:'',
     branchName:branchobj[0].name
  },()=>{
      this.getPersonList()
  })
    
  }
  //选择业务员
  onChangee(value){
    console.log(`selected ${value}`);

    let personobj =  this.state.personList.filter((item)=>{
        if(item.value===value){
            return item
        }
    })
    this.setState({
        dealmanId :value,
        dealmanName:personobj[0].name
     })
  }

//选择日期
  chansg(value,dateString){
    //  dateString = dateString.replace(/-/g,"")
     console.log(dateString)
      this.setState({
          signTime: value,
          data:dateString
      })  
  }
//开始时间
  time(value,tt){
     this.setState({
        startTimee: value,
         startTime:tt
     })  
  }
//结束时间
  timee(value,gg){
    this.setState({
       endTimee: value,
        endTime:gg
    })  

}
//滑块速度控制
  disabled(value){
     this.setState({
         speed:value
     })
console.log(this.state.speed)
// this.startAnimation()

  }
//查询网点数据
  searchSalePoint(value) {
      console.log(1)
    setTimeout(()=>{
        if(value){
            this.getAddressList(value)  
        }    
    },200)
    
}

async getAddressList(name){
    console.log(2)
    let url = 'base/branch'
    let data ={
        branchName:name
    }
    let datas = await axios.post(
        { 
            url,
            data
        }) 
        console.log(datas.data)
        this.setState({
        addressList:datas.data
    })
}
async getPersonList(){
    let url = `base/branch/${this.state.branchId}/dealman`
    let data = {
        branchId:this.state.branchId,
        dateTime:this.state.dateTime,
        mapType:this.state.mapType
    }
    let datas = await axios.get(
        { 
            url,
            data
        }) 
        this.setState({
        personList:datas.data
    })
}


//数据返回
async database(){
    var that = this

    if(marker != null) mappGD.remove(marker);
    $('#total').text('');
    $('#sendCount').text('');
    $('#time').text('');
    $('#lngLat').text('');
    //删除标点
    for(var i=0;i<listMarket.length;i+=1){
        mappGD.remove(listMarket[i]);
    }
    passedPolyline.setPath([]);

    var url = 'http://aoi.yundasys.com:8060/tv/gps/salesman/track/playback?branch_code='+this.state.branchId+'&salesman_id='+this.state.dealmanId+'&date='+this.state.data+'&start_time='+this.state.startTime+'&end_time='+this.state.endTime;
        $.getJSON(url,function(result){
    		if (result.status == 200) {
    			if (result.data.length == 0) {
                    Modal.confirm({
                        title: '系统提示',
                        content: '没有数据',
                        okText: '确认',
                        cancelText: '取消',
                        mask:false,
                        zIndex:111111111111111111,
                        centered:true,
                      });
    				return;
    			}
                datat = result.data;
              
    		that.init();
    		} else {
    			alert('数据获取失败'+result.message);
    		}
	    });
}  

init(){
    var _this = this
    for (var i = 0; i < datat.length; i++) {
        var lng = datat[i].longitude;
        var lat = datat[i].latitude;
        points[i] = [lng,lat];
    }
    // $('#total').text(points.length);
        this.setState({
            total:points.length
        })

    //初始化车子图标
   marker = new window.AMap.Marker({
        map:mappGD,
        position: points[0],
        icon: "https://webapi.amap.com/images/car.png",
        offset: new window.AMap.Pixel(-26, -13),
        autoRotation: true,
        angle:-90,
    });
   // 所有点展示
    for(var i=0;i<points.length;i+=1){
        this.mark(points[i]);
    }
    //调整视野达到最佳显示区域
    mappGD.setFitView();
    
    
	    // 批量获取所有的两点导航路径,存放在 routePointsJson ，key为 startPoint+'-'+endPoit
	    for (var i = 0; i < points.length; i++) {
	    	if (i+1 == points.length) {//结束
	    		continue;
	    	}
	    	var start = points[i];
	    	var end = points[i+1];
	    	this.rideRoute(start,end);
	    }

    //移动车子
    marker.on('moving', function (e) {
    var len = e.passedPath.length;
    var lng = e.passedPath[len-1].lng;
    var lat = e.passedPath[len-1].lat;
    var location = [lng,lat];

       //途径需要标点的地方
    for(var i=0;i<listNoMarket.length;i+=1){
        
        var point = listNoMarket[i];
        var p_lng = point[0];
        var p_lat = point[1];
        //路经的坐标与票件坐标相同
        if (p_lng == lng && p_lat == lat) {

            //标记路径票件坐标，为了防止导航实际路径坐标有遗漏，将此坐标之前的遗漏点也标记处出来，并从未标记点集合中移除
            for (var j = 0; j <= i; j++) {
                var d_point = listNoMarket[j];
                _this.mark(d_point);
            }
            listNoMarket.splice(0, i+1);
            return;
        }
    }
    passedPolyline.setPath(e.passedPath);
    });
}



 rideRoute(startPoint,endPoit){
    	
    //startPoint[116.397933,39.844818]
    //根据起终点坐标规划骑行路线
    riding.search(startPoint,endPoit, function(status, result) {
        var routePoints = [];
        // result即是对应的骑行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
        if (status === 'complete') {

            if (result.routes && result.routes.length) {
                let rides = result.routes[0].rides;
                // console.log(rides);
                for (var i = 0; i < rides.length; i++) {
                    var path = rides[i].path;
                    //点
                    for (var j = 0; j < path.length; j++) {
                        routePoints.push([path[j].lng,path[j].lat]);
                    }
                }
            }
            routePointsJson[startPoint+'-'+endPoit] = routePoints;
            // console.log(routePoints)
        } else {
            // console.log('骑行路线数据查询失败' + result)
        }

        // console.log(routePointsJson);
    });
};

 mark(point){
    	
    var index = listMarket.length;
    var title = '已完成票件：'+(listMarket.length+1)+'\n完成时间：';
    // console.log(datat)
    if (datat[index].hasOwnProperty('location_create_time')) {
        var time = datat[index].location_create_time;
        title = title+time;
        $('#time').text(time);
    }
    // listMarket = []
    var mkt = new window.AMap.Marker({
        map: mappGD,
        position:point,
        icon: icon,
        offset: new window.AMap.Pixel(-9, -18),
        autoRotation: true,
        title: title,
    });
    listMarket.push(mkt);
    $('#sendCount').text(listMarket.length);
}

    //播放轨迹
     startAnimation () {
         console.log(1)
        console.log(points)
    	if (points.length == 0) {
    		alert('请先获取业务员票件信息');
    		return;
    	}
        $('#lngLat').text(Object.keys(routePointsJson).length);
        //删除标点
        for(var i=0;i<listMarket.length;i+=1){
    		mappGD.remove(listMarket[i]);
	    }
	    listMarket = [];
	    listNoMarket = [];
	    listNoMarket = listNoMarket.concat(points);

	    //标记起始点
	    this.mark(points[0]);
	    listNoMarket.splice(0, 1);

		//完善导航路径
		lineArr = [];
		for (var i = 0; i < points.length; i++) {

	    	var start = points[i];
	    	lineArr.push(start);

	    	var end = points[i+1];

	    	var pts = routePointsJson[start+"-"+end];
	    	if (pts) {
				lineArr = lineArr.concat(pts);
	    	}
	    }
        //开始移动
        console.log(this.state.speed)
        marker.moveAlong(lineArr,this.state.speed);
        console.log(2)

    }
    //速度调节
    // changeSpeed(speed) {
    //     // var speed = $('#speed').val();
    //     // console.log(speed);
    //     this.startAnimation();
    // };

     pauseAnimation () {
        marker.pauseMove();
    }

     resumeAnimation () {
        marker.resumeMove();
    }

     stopAnimation () {
        marker.stopMove();
    }
       render(){
        const stateList = ['张三','里斯','王二麻子','阳台','宿舍','厨房']
           return(
               <div style={{margin:"-24px"}}>
                <div style={{width:"100%",height:document.body.clientHeight-80,padding:"0",margin:"0",position:"relative"}} id="gaode">
                <img style={{position:"absolute",zIndex:"999999",bottom:0,right:0,opacity:this.state.isshow == false ?"1":"0",transition:".5s"}} onClick={this.show.bind(this)} src={require('../../asset/images/massPoint.png')} />
                  <div className="input-card" style={{opacity:this.state.isshow == true ? "1":"0",transition:".5s"}}>
                  <img style={{position:"absolute",left:"2.5rem",top:".2rem"}} onClick={this.close.bind(this)} src={require('../../asset/images/close.png')} alt=""></img>
                    <h3 className="h">票件信息</h3>
           <p className="p">总票件：<label id='total'>{this.state.total}</label></p>
                    <p className="p">已完成票件：<label id='sendCount'></label></p>
                    <p className="p">票件完成时间：<label id='time'></label></p>
                    <p className="p">票件地址导航解析数：<label id='lngLat'></label></p>
                    <br />
            <h3 className="h" style={{marginTop:"0px"}}>业务员信息</h3>
            <div className="input-item">
                <Select
                size={"small"}
                showSearch
                optionFilterProp="children"     
                placeholder="请选择"
                style={{ width: 120 }}
                onChange={this.onChange.bind(this)}
                onSearch={this.searchSalePoint.bind(this)}
                // onFocus={this.handleFocus.bind(this)}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                notFoundContent={<Spin size="small" />}
                disabled={false}
                value={this.state.branchId===''?undefined:this.state.branchId}
                >
                  { this.state.addressList.map((item) =>
                    <Option value={item.value} key={item.id}>{item.name}</Option>
                    )}
            
                </Select>

                <Select
                size={"small"} 
                showSearch
                optionFilterProp="children"     
                placeholder="请选择"
                style={{ width: 120 }}
                onChange={this.onChangee.bind(this)}
                // onFocus={this.handleFocus.bind(this)}
                getPopupContainer={triggerNode => triggerNode.parentNode} 
                notFoundContent={<Spin size="small" />}
                disabled={false}
                value={this.state.dealmanId ===''?undefined:this.state.dealmanId }
                >
                    { this.state.personList.map((item) =>
                    <Option value={item.value} key={item.id}>{item.name}-签收量{item.count}</Option>
                    )}
                </Select>

            </div>
            <br />
            <div className="input-item" style={{marginTop:"0px"}}>
            <label>票件日期：<DatePicker placeholder="选择日期"  size={"small"} style={{width:"180px"}} onChange={this.chansg.bind(this)} /></label>
                {/* <label>票件日期&nbsp;</label><input id="date" name="date" type="date" /> */}
            </div>
            <div className="input-item">
                <label>时间范围：<TimePicker placeholder="开始" size={"small"} style={{width:"80px"}} onChange={this.time.bind(this)} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />~~
                                <TimePicker placeholder="结束" size={"small"} style={{width:"80px"}} onChange={this.timee.bind(this)} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
                </label>
            </div>
            <br />
            <div style={{marginTop:"5px"}} className="input-item">
                <Button type="button" className="btn" onClick={this.database.bind(this)} style={{width:"140px"}} shape={"round"}  id="getpj" >获取业务员票件</Button>
            </div>
            
            <br />
            <h3 className="h"  style={{marginTop:"5px"}}>轨迹回放控制</h3>
            <div className="input-item">
                {/* <label>速度调节&nbsp;</label><input id="speed" type="range" className="form-control" min="100" max="20000" step="1" value="10000"  /> */}
                <label>速度调节&nbsp;<Slider defaultValue={100,2000}  onChange={this.disabled.bind(this)} /></label>
            </div>
            <div className="input-item">
                <Button className="btn" onClick={this.startAnimation.bind(this)} shape={"round"}  value="开始动画" >开始动画</Button>
                <Button className="btn" onClick={this.pauseAnimation.bind(this)} style={{marginLeft:"20px"}} shape={"round"}  value="暂停动画" >暂停动画</Button>
            </div>
            <div className="input-item">
                <Button className="btn" onClick={this.resumeAnimation.bind(this)}  shape={"round"} value="继续动画">继续动画</Button>
                <Button className="btn" onClick={this.stopAnimation.bind(this)} style={{marginLeft:"20px"}}  shape={"round"} value="停止动画" >停止动画</Button>
            </div>
            <br />
            </div>    
            </div>
    </div>
           )
       }

       componentDidMount(){
            mappGD = new window.AMap.Map('gaode', {
            zoom: 18,
            center: [116.404, 39.915]
        });
     
            passedPolyline = new window.AMap.Polyline({
                map: mappGD,
                showDir:true,//显示方向
                strokeColor: "#28F",  //线颜色
                strokeWeight: 6,      //线宽
            });
          //高德控件
        window.AMap.plugin(['AMap.ToolBar', 'AMap.Driving'], function () { //异步同时加载多个插件
            var toolbar = new window.AMap.ToolBar();
            mappGD.addControl(toolbar);
          });
       }

        componentWillUnmount(){ 
            // 移除监听事件
        }
}
// const TrPlaybackk = Form.create({})(TrPlayback);
export default TrPlayback