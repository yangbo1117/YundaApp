import React, { Component } from "react"
// import axios from '../../../../axios'
import ReactTooltip from "react-tooltip"
import './baiduGDmap.scss'
import logo from '../../../../asset/images/red.png'
import dsdlog from '../../../../asset/images/collectPoint.png'
import {Modal,Button,Input,Tooltip } from 'antd'
import $ from "jquery"

let mapBD = null  //定义容器变量展示百度地图
let mapGD = null  //定义容器展示高德地图
var fit = new Array(); //存放高德点标注容器
var markerArray = new Array(); 
var windowsArr = new Array(); 
var infoWindow = null;
let markerArrayy = [] //自适应视野容器
let satelliteLayer = new window.AMap.TileLayer.Satellite({	    	
    zIndex:19
});	

class DsdPoint extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            deskHeight: document.body.clientHeight-140, //根据屏幕设置地图高度
            istrue:false,           
            isSatell:true,       //控制卫星图展示
            Satelliate:"卫星图", //控制卫星图文字展示
            baiduAmi:true,      //控制百度动画展示
            baidu:"(放大)百度",
            gaodeAmi:true,       //控制高德动画展示
            visible:true,
            loading:false,      //按钮加载loading
            baidulng:'',        //保存百度搜索地址的经纬度
            baidulat:'',
            loadingg:false,    //按钮loading
            prpaddress:this.props.address, //原始地址
            collectPointDetailList:this.props.collectPointDetailList,  //签收点详情数据
            value:this.props.collectPointDetailList[0].collectLocation
        }
        this.search = this.search.bind(this)
        this.save = this.save.bind(this)
        this.show = this.show.bind(this)
        this.hidden = this.hidden.bind(this)
        this.gaodee = this.gaodee.bind(this)
        this.gaodeX = this.gaodeX.bind(this)
    }

handleSize = () => {
    this.setState({
        deskHeight:document.body.clientHeight-120,
    });
}
confirm() {
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
//百度搜索
search = (keywords) =>{
    var that = this
    console.log(keywords)
    if(keywords == null || keywords == "" || keywords == "undefind"){
        // alert('警告,请填入需要搜索的关键词！');
        this.confirm()
        return;
    }
    var BMap = window.BMap
    mapBD.clearOverlays()
    markerArrayy.splice(1,markerArrayy.length-1)
    var options = {      
        renderOptions:{map:mapBD},
        pageCapacity: 1, 
        onSearchComplete: function(results){      
          
            if(results.Sq[0] !== undefined){
                that.setState({
                    baidulng:results.Sq[0].point.lng,
                    baidulat:results.Sq[0].point.lat
                })
                var pointmap = new BMap.Point(results.Sq[0].point.lng, results.Sq[0].point.lat);
                markerArrayy.push(pointmap)
                setTimeout( () => {
                    that.setZoom(markerArrayy);
                }, 1000)
            }else{
                Modal.confirm({
                    title: '系统提示',
                    content: '百度返回地址结果没有经纬度！',
                    mask:false,
                    zIndex:111111111111111111,
                    centered:true,
                  });   
            }
        }      
     };      
    var local = new BMap.LocalSearch(mapBD, options)     
    local.search(keywords)
    this.gaode(keywords)
}
//触发父组件事件关闭纠偏窗口
fath(){
    this.props.getChildValue()
}
    //高德搜索
        gaode = (keywords) => {
            var that = this
            for(var index = 0;index<fit.length;index++){
                fit[index].setMap(null);
            }
            fit = [];
            if(infoWindow != null){
                infoWindow.close();
            }
            window.AMap.service(["AMap.PlaceSearch"],function(){
                var mapSearch = new window.AMap.PlaceSearch({ //构造地点查询类
                    pageSize:1,
                    pageIndex:1,
                });
                //关键字查询
                mapSearch.search(keywords, function(status, result){
                    if(status === 'complete' && result.info === 'OK'){
                
                        that.keywordSearch_CallBack1(result)
                    }
                }); 
            });
        }

        keywordSearch_CallBack1 = (data) =>{
   
            var poiArr = data.poiList.pois;
            var resultCount =poiArr.length;
            for (var i = 0; i < resultCount; i++) {
                this.addmarker1(i,poiArr[i]);
            }
        }

        addmarker1 = (i, d) => {
            var that = this
            var lngX = d.location.getLng();
            var latY = d.location.getLat();
           
            var markerOption = {
                map:mapGD,
                icon:logo,
                // icon: '//webapi.amap.com/theme/v1.3/markers/b/mark_r.png',
                position:new window.AMap.LngLat(lngX, latY),
                topWhenMouseOver:true
            };
            var mar = new window.AMap.Marker(markerOption);         
            markerArray.push(new window.AMap.LngLat(lngX, latY));
            fit.push(mar);
            infoWindow = new window.AMap.InfoWindow({
                content:"<h3><font color=\"#00a6ac\">  "+ d.name + "</font></h3>" + that.TipContents(d.type, d.address, d.tel),
                size:new window.AMap.Size(250, 0),
                autoMove:true, 
                offset:new window.AMap.Pixel(2,-20),
                closeWhenClickMap:true
            });
            windowsArr.push(infoWindow);
            var aa = function (e) {infoWindow.open(mapGD, mar.getPosition());};
            window.AMap.event.addListener(mar, "click", aa);
            mapGD.setFitView(fit);
        }

        TipContents = (type, address, tel) => {  //窗体内容
            if (type == "" || type == "undefined" || type == null || type == " undefined" || typeof type == "undefined") {
                type = "暂无";
            }
            if (address == "" || address == "undefined" || address == null || address == " undefined" || typeof address == "undefined") {
                address = "暂无";
            }
            if (tel == "" || tel == "undefined" || tel == null || tel == " undefined" || typeof address == "tel") {
                tel = "暂无";
            }
            var str = "  地址：" + address + "<br />  电话：" + tel + " <br />  类型：" + type;
            return str;
        }
        // 百度地图自适应视野
        setZoom(bPoints){
            var view = mapBD.getViewport(eval(bPoints));
            var mapZoom = view.zoom;
            var centerPoint = view.center;
            mapBD.centerAndZoom(centerPoint, mapZoom-1);
        }

        //键盘回车事件
        onKeyDown = (event) => {
    
            if (event.keyCode == "13") {
                　　　　//回车执行查询
                    this.search(this.state.value)

                　　}
                }
        //保存
         save(){
            // let params = JSON.stringify({"data": {"address": this.state.value,"latitude": this.state.lng,"longitude": this.state.lat,"latitudeOld":this.state.ysdlat,"longitudeOld":this.state.ysdlng}})
            var that =  this
            let url ="http://aoi.yundasys.com:8061/tv/validate/delivery/correctAddressByBaidu"
            let data = {
                "data": {
                    "address": this.props.address,
                    "latitude": this.state.lat,
                    "longitude": this.state.lng,
                    "latitudeOld":this.state.ysdlat, 
                    "longitudeOld":this.state.ysdlng
                }
                }
                    $.ajax({
                        url: url,
                        type: "post",
                        contentType: 'application/json;charset=UTF-8',
                        async: false,
                        datatype: "JSON",
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        data: JSON.stringify(data),
                        success: function (res) {
                            console.log(res)
                            if(res.code == 200 && res.result == true){
                                Modal.confirm({
                                    title: '系统提示',
                                    content: '保存成功！',
                                    okText: '确认',
                                    cancelText: '取消',
                                    mask:false,
                                    zIndex:111111111111111111,
                                    centered:true,
                                    onOk:()=>{
                                        setTimeout(() => {
                                          that.fath()
                                        },750);
                                    }
                                  });
                            }
                        }
                    })
            console.log("请求澄清的接口")
           this.handleOk()
           this.saveTZ()
        }
         saveTZ(){
             console.log("yyy")
            let url = `http://aoi.yundasys.com:8061/tv/branch/${this.state.branchId}/dealman/${this.state.dealmanId}/rectify`
            let DataTT = {
                        "address":this.props.address,
                        "newLngLat": this.state.lng+','+this.state.lat,
                        "mailNo": this.state.nowMailNo,
                        "mapType":"baidu",
                        "signTime":this.state.signTime
                      }
                      $.ajax({
                        url: url,
                        type: "PUT",
                        contentType: 'application/json;charset=UTF-8',
                        // async: false,
                        crossDomain: true,
                          xhrFields: {
                              withCredentials: true
                          },
                        data: JSON.stringify(DataTT),
                        success: function (res) {
                            console.log(res)
                          // $.messager.alert('系统提示',"请求接口成功",'')
                          if(res.code == 20003 || res.result == false){
                            Modal.confirm({
                                title: '系统提示',
                                content:res.message,
                                okText: '确认',
                                cancelText: '取消',
                                mask:false,
                                zIndex:111111111111111111,
                                centered:true,
                                onOk:()=>{
                                window.location.href = res.data.casRedirect+"?redirectUrl="+encodeURI(window.location.href)
                                }
                              });
                          }
                        },
                        error:function(){
                          alert("发送请求出错")
                        }
                    })                    
        }


        savebaidu = () =>{
            // let params = JSON.stringify({"data": {"address": this.state.value,"latitude": this.state.lng,"longitude": this.state.lat,"latitudeOld":this.state.ysdlat,"longitudeOld":this.state.ysdlng}})
            var that =  this
            let url ="http://aoi.yundasys.com:8061/tv/validate/delivery/correctAddressByBaidu"
            let data = {
                "data": {
                    "address": that.state.prpaddress,
                    "latitude": this.state.baidulat,
                    "longitude": this.state.baidulng,
                    "latitudeOld":this.state.ysdlat, 
                    "longitudeOld":this.state.ysdlng
                }
                }
                    $.ajax({
                        url: url,
                        type: "post",
                        contentType: 'application/json;charset=UTF-8',
                        async: false,
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        datatype: "JSON",
                        data: JSON.stringify(data),
                        success: function (res) {
                            console.log(res)
                            if(res.code == 200 && res.result == true){
                                Modal.confirm({
                                    title: '系统提示',
                                    content: '保存成功！',
                                    okText: '确认',
                                    cancelText: '取消',
                                    mask:false,
                                    zIndex:111111111111111111,
                                    centered:true,
                                    onOk:()=>{
                                        setTimeout(() => {
                                          that.fath()
                                        },750);
                                    }
                                  });
                            }
                        }
                    })
           this.handleOk()
            this.savetzbaidu()        
        }

        savetzbaidu=()=>{
            let url = `http://aoi.yundasys.com:8061/tv/branch/${this.state.branchId}/dealman/${this.state.dealmanId}/rectify`
            let DataTT = {
                        "address":this.state.prpaddress,
                        "newLngLat": this.state.baidulng+','+this.state.baidulat,
                        "mailNo": this.state.nowMailNo,
                        "mapType":"baidu",
                        "signTime":this.state.signTime
                      }

                      $.ajax({
                        url: url,
                        type: "PUT",
                        contentType: 'application/json;charset=UTF-8',
                        crossDomain: true,
                          xhrFields: {
                              withCredentials: true
                          },
                        data: JSON.stringify(DataTT),
                        success: function (res) {
                            console.log(res)
                          // $.messager.alert('系统提示',"请求接口成功",'')
                          if(res.code == 20003 || res.result == false){
                            Modal.confirm({
                                title: '系统提示',
                                content:res.message,
                                okText: '确认',
                                cancelText: '取消',
                                mask:false,
                                zIndex:111111111111111111,
                                centered:true,
                                onOk:()=>{
                                    window.location.href = res.data.casRedirect+"?redirectUrl="+encodeURI(window.location.href)
                                    }
                              });
                              
                          }
                        },
                        error:function(){
                          alert("发送请求出错")
                        }
                    })                    

        }
        //展示卫星图
        show(){
            satelliteLayer.setMap(mapGD);
            this.setState({
                Satelliate:"原始图",
                isSatell:false
            })
            console.log("卫星图")
             mapBD.setMapType(window.BMAP_HYBRID_MAP)
        }
        //展示原始图
        hidden(){
            this.setState({
                Satelliate:"卫星图",
                isSatell:true
            })
            satelliteLayer.setMap(null);
            mapBD.setMapType(window.BMAP_NORMAL_MAP)
        }
        //高德动画
        gaodee(){
            var that = this 
            console.log("gaode")

        }
        //高德动画
        gaodeX(){
            console.log("gaodeX")
        }
        //输入框双向绑定事件
        handleChange(e){
            this.setState({
                value : e.target.value
            })
        }
        //点击保存按钮加载loading事件
        handleOk = () => {
            this.setState({ loading: true });
            setTimeout(() => {
              this.setState({ loading: false});
            }, 3000);
          };

       render(){
           const {deskHeight} = this.state
           return(
               <div>
                   <div style={{marginTop:"-8px"}}> 
                   <Input value={this.state.value} onKeyUp={this.onKeyDown.bind(this)} onChange={this.handleChange.bind(this)} style={{width:"500px",marginLeft:"8px"}} />
                   <Button key="1" type="primary" id="ntn"  onClick = {(ev)=>{this.search(this.state.value)}}>
                   搜索
                    </Button>    
                   <Button key="2" type="primary" id="ntn" loading={this.state.loading} onClick = {this.save}>
                   保存
                    </Button>
                  
                   <Button key="3" type="primary" id="ntn"  onClick = {this.state.isSatell == true ? this.show:this.hidden}>
                   {this.state.Satelliate}
                    </Button>
                    <Button data-html={true} data-class="mytooltip" data-tip={'注：百度保存按钮直接取百度搜索出来的地址经纬度进行保存，不需要拖动点标注，使用前请确认百度搜索地址是否是您需要的！'} data-place={"bottom"} key="4" type="primary" id="ntn" loading={this.state.loadingg} onClick = {this.savebaidu}>
                   百度保存
                    </Button>
                    <ReactTooltip html={true}/>
                   </div>  

                     <div id="baiduMAP" style={{height:deskHeight,marginTop:"10px"}}>
                    
                    <div id="baidu">
                    {/* <a href="#" style={{position:"absolute",right: "10px",top: "10px",zIndex:99999999999999,color:"red"}}>百度</a> */}

                    </div>

                    <div id="gaode">
                    {/* <a href="#" onClick = {this.state.isSatell == true ? this.gaodee:this.gaodeX}  style={{position:"absolute",right: "10px",top: "6px",zIndex:"9999999999",color:"red"}}>高德</a> */}
                    </div>
                     </div>  
               </div>
           )
       }

       componentDidMount(){
           console.log(21)
           console.log(this.state.collectPointDetailList)
           console.log(this.state.collectPointDetailList[0].collectLngLat.split(",")[0],this.state.collectPointDetailList[0].collectLngLat.split(",")[1])
           console.log(21)

        //     collectId: "FC0214482"
        //     collectLngLat: "121.175642,31.150799"
        //     collectLocation: "上海市上海市青浦区崧达路81号遇见之家公寓大门口丰巢快递柜"
        //     collectName: "崧达路81号遇见之家公寓大门口丰巢快递柜"
        //     collectSource: "15"
        //     collectSourceName: "丰巢"
        //     collectType: 1
        //     collectTypeName: "快递柜代收"

        window.addEventListener('resize', this.handleSize);
        var BMap = window.BMap
        mapBD = new BMap.Map("baidu"); // 创建Map实例
        var point = new BMap.Point(this.state.collectPointDetailList[0].collectLngLat.split(",")[0],this.state.collectPointDetailList[0].collectLngLat.split(",")[1]);
        mapBD.centerAndZoom(point); // 初始化地图,设    置中心点坐标和地图级别
        mapBD.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        var myIcon = new BMap.Icon(dsdlog, new BMap.Size(40,40))
        var marker = new BMap.Marker(point,{icon:myIcon,});
        marker.enableDragging();
        marker.disableMassClear();
        marker.setZIndex(99999999999999)
        markerArrayy.splice(1,markerArrayy.length-1)
        markerArrayy.push(point)
        mapBD.addOverlay(marker);
        //百度控件
        var navigationControl = new BMap.NavigationControl({
            // 靠左上角位置
            anchor: window.BMAP_ANCHOR_TOP_LEFT,
            // LARGE类型
            type: window.BMAP_NAVIGATION_CONTROL_LARGE,
            // 启用显示定位
            enableGeolocation: true
          });
          mapBD.addControl(navigationControl);
          // 添加定位控件
          var geolocationControl = new BMap.GeolocationControl();
          geolocationControl.addEventListener("locationSuccess", function (e) {
            // 定位成功事件
            var address = '';
            address += e.addressComponent.province;
            address += e.addressComponent.city;
            address += e.addressComponent.district;
            address += e.addressComponent.street;
            address += e.addressComponent.streetNumber;
            // alert("当前定位地址为：" + address); 
          });
          geolocationControl.addEventListener("locationError", function (e) {
            // 定位失败事件
            alert(e.message);
          });
          mapBD.addControl(geolocationControl);
          //监听百度鼠标拖动
          var that = this
          marker.addEventListener("dragend", function(e){    
            that.setState({
                lng:e.point.lng,
                lat:e.point.lat
            })
        })

      setTimeout(function(){
            that.search(that.state.collectPointDetailList[0].collectLocation)
        },200)

        
          //加载高德地图
         mapGD = new window.AMap.Map('gaode', {
            zoom: 18,
            center: [116.404, 39.915]
        });
     
          //高德控件
        window.AMap.plugin(['AMap.ToolBar', 'AMap.Driving'], function () { //异步同时加载多个插件
            var toolbar = new window.AMap.ToolBar();
            mapGD.addControl(toolbar);
          });
          
       }

        componentWillUnmount() { 
            // 移除监听事件
            window.removeEventListener('resize', this.handleSize);
            
        }
}

export default DsdPoint