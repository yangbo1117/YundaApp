import React from 'react'
import './index.scss'
import '../../css/map.scss'
import MapFunc from '../MapFunc/index.js'
import axios from '../../../../axios'
import InfoDetail from '../InfoDetail/index.js'
import PointClick from '../InfoDetail/pointClick'
import { Popconfirm,Modal, Button } from 'antd'
import ModalInfo from '../../../../components/ModelInfo'
import Baidu from "./baiduGDmap"
import DsdPoint from './dsdPoint'
let singlePoint

class Map extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            map:'',
            pointCollection:'',//海量点集合实例
            correctPointCollection:'',//海量点已纠偏海量点集合
            label:'',//海量点标签
            menuLabel:'',//菜单标签
            labelArr:[],//海量点标签集合
            polygonList:[], //围栏实例数组
            markerArr : [], //代收点数组
            massMarkObj:'', //海量点实例
            collectPointDetailList:[], //代收点详情信息
            collectLocation:"",//代收点地址
            nowMailNo:'', //当前点击海量点的订单号
            nowLnglat:'', //当前点击海量点的经纬度
            nowSignTime:'', //当前点击海量点的签收时间
            nowSignNum:'', //当前点击海量点的签收时间
            nowBranchId:'', //当前点击海量点的网点
            nowDealmanId:'', //当前点击海量点的业务员
            nowBranchName:'', //当前点击海量点的网点名称
            nowDealmanName:'', //当前点击海量点的业务员名称
            visible:false, //展示海量点的详情模态框
            nowDetailObj:{},//订单详情数据
            isShow:false, //展示代收点详情
            isPoint:false,//展示海量点的详细信息
            isConfirm:false,
            fenceChecked:true,
            collectPointChecked:true,
            originChecked:true,
            mailNodata:'',
            pointSET:'',
            viisiblle:false,
            hasChildd:false,
            savepointjh:null,
            savecorrectpointjh:null
        }
    }
    renderMap = (res) =>{
        const _this = this
        // let singlePoint
        let correctSinglePoint
        let content = _this.refs.container
        let points = []   
        let correctPoints = []      
        //  创建地图   
            this.setState({
                map:  new window.BMap.Map(content,{
                    zoom:10
                })
            },()=>{
                let branchId,dealmanId
                this.state.map.centerAndZoom(new window.BMap.Point(105.000, 38.000), 10);     // 初始化地图,设置中心点坐标和地图级别
                this.state.map.enableScrollWheelZoom(true); 
                if(res.length!==0){
                    res.forEach((value,index) => {
                        this.state.map.centerAndZoom(new window.BMap.Point(value.point.lng,value.point.lat), 16);
                        let point = new window.BMap.Point(value.point.lng,value.point.lat)
                        if(value.correctType==='1'){                          
                            points.push(point)
                        }else{
                            correctPoints.push(point)
                        }
                        branchId = value.branchId
                        dealmanId = value.dealmanId
                       // let marker = new window.BMap.Marker(point);  // 创建标注
                    });
                    let options = {
                        color: '#34AAFC'
                    } 
                    let correctOptions={
                        color: '#FD6B0B'
                    }   
                    // 初始化PointCollection
                    let pointCollection=new window.BMap.PointCollection(points, options)  
                    let correctPointCollection=new window.BMap.PointCollection(correctPoints, correctOptions)  
                    this.setState({
                        pointCollection,
                        correctPointCollection,
                        savepointjh:points,
                        savecorrectpointjh:correctPoints
                    }) 
                    
                    //监听海量点鼠标移入时事件
                    // pointCollection.addEventListener('mouseover',(e)=>{
                    //     let options ={
                    //         color: '#FF00FF'
                    //     }
                    //     singlePoint=new window.BMap.PointCollection([new window.BMap.Point(e.point.lng,e.point.lat)], options)
                    //     this.state.map.addOverlay(singlePoint);  // 添加Overlay
                    // })
                    //   //监听海量点鼠标移出时事件
                    //   pointCollection.addEventListener('mouseout',(e)=>{ 
                    //     this.state.map.removeOverlay(singlePoint);  // 移除Overlay
                    // })

                    //  //监听已纠偏鼠标移入时事件
                    //  correctPointCollection.addEventListener('mouseover',(e)=>{
                    //     let options ={
                    //         color: '#FF00FF'
                    //     }
                    //     correctSinglePoint=new window.BMap.PointCollection([new window.BMap.Point(e.point.lng,e.point.lat)], options)
                    //     this.state.map.addOverlay(correctSinglePoint);  // 添加Overlay
                    // })
                    //   //监听已纠偏鼠标移出时事件
                    //   correctPointCollection.addEventListener('mouseout',(e)=>{ 
                    //     this.state.map.removeOverlay(correctSinglePoint);  // 移除Overlay
                    // })
                   //监听鼠标移入时事件
           /*          pointCollection.addEventListener('mouseover',(e)=>{
                        if(res.length!==0){ 
                            for(let i = 0; i < res.length; i++){
                                if(e.point.lng==res[i].point.lng && e.point.lat==res[i].point.lat){
                                    let point = new window.BMap.Point(res[i].point.lng,res[i].point.lat)
                                    //设置标签
                                    let opts = {
                                        position : point,    // 指定文本标注所在的地理位置
                                        offset   : new window.BMap.Size(30, -30)    //设置文本偏移量
                                    }
                                    this.setState({
                                        nowMailNo:res[i].mailNo,
                                        nowSignTime:res[i].batchTime,
                                        nowBranchId:res[i].branchId,
                                        nowDealmanId:res[i].dealmanId,
                                    })
                                    this.queryMailnoDetail(res[i].mailNo).then((data)=>{
                                        let label = new window.BMap.Label("<div class='info' style='height:1.5rem;width:1.8rem;color:black;fontSize:0.12rem;padding: 3px 7px;position: relative;'>"+
                                                                                "<p>运单号："+res[i].mailNo+"</p>"+
                                                                                "<p>经纬度："+res[i].point.lng+','+res[i].point.lat+"</p>"+
                                                                                "<p>签收时间："+res[i].batchTime+"</p>"+
                                                                                "<p>签收次数："+res[i].signNum+"</p>"+
                                                                                "<p>原始地址："+data.address+"</p>"+
                                                                                "<p>AOI名称："+data.aoiName+"</p>"+
                                                                                "<p>AOI经纬度："+data.aoiLocation+"</p>"+
                                                                                "<p>运单来源："+data.source+"</p>"+
                                                                          "</div>", opts) // 创建文本标注对象
                                        this.state.labelArr.push(label)
                                        this.setState({
                                            label
                                        },()=>{
                                                this.state.label.setStyle({
                                                    color : "red",
                                                    fontSize : "12px",
                                                    height : "20px",
                                                    lineHeight : "20px",
                                                    fontFamily:"微软雅黑"
                                                    });                                     
                                                        this.state.map.addOverlay(this.state.label);                                                                            
                                                }) 
                                    })
                        
                                        break
                                    }
                            }                
            
                    }           
                      });  */ 
                          //监听鼠标点击时事件
                    pointCollection.addEventListener('click',(e)=>{
                        this.state.map.removeOverlay(singlePoint);
                        let options ={
                            // size: window.BMAP_POINT_SIZE_SMALL,
                            // shape: window.BMAP_POINT_SHAPE_STAR,
                            color: '#FF00FF'
                        }
                        singlePoint=new window.BMap.PointCollection([new window.BMap.Point(e.point.lng,e.point.lat)],options)
                        this.state.map.addOverlay(singlePoint);  // 添加Overlay
                        if(res.length!==0){ 
                          
                            for(let i = 0; i < res.length; i++){
                                if(e.point.lng==res[i].point.lng && e.point.lat==res[i].point.lat){        
                                    this.queryMailnoDetail(res[i].mailNo).then((data)=>{
                                        
                                        this.setState({
                                            nowLnglat:res[i].point.lng+'，'+res[i].point.lat,
                                            nowMailNo:res[i].mailNo,
                                            nowSignTime:res[i].batchTime,
                                            nowBranchId:res[i].branchId,
                                            nowDealmanId:res[i].dealmanId,
                                            nowSignNum:res[i].signNum,
                                            nowBranchName:res[i].branchName,
                                            nowDealmanName:res[i].dealmanName,
                                            nowDetailObj:data,
                                            // visible:true
                                            isPoint:true
                                        })
                                    })
                                        break
                                    }
                            }                
            
                    }           
                      }); 
                      correctPointCollection.addEventListener('click',(e)=>{
                        this.state.map.removeOverlay(singlePoint);
                        let options ={
                            color: '#FF00FF'
                        }
                        singlePoint=new window.BMap.PointCollection([new window.BMap.Point(e.point.lng,e.point.lat)], {color: '#FF00FF'})
                        this.state.map.addOverlay(singlePoint);  // 添加Overlay
                        if(res.length!==0){ 
                            for(let i = 0; i < res.length; i++){
                                if(e.point.lng==res[i].point.lng && e.point.lat==res[i].point.lat){                                
                                    this.queryMailnoDetail(res[i].mailNo).then((data)=>{
                                        this.setState({
                                            nowLnglat:res[i].point.lng+'，'+res[i].point.lat,
                                            nowMailNo:res[i].mailNo,
                                            nowSignTime:res[i].batchTime,
                                            nowSignNum:res[i].signNum,
                                            nowDetailObj:data,
                                            isPoint:true
                                            // visible:true
                                        })
                                    })
                                        break
                                    }
                            }                
                    }           
              
                      });
                //百度地图记录海量点状态，在隐藏海量点时，地图缩放，拖拽任然继续展示海量点
               this.state.map.addEventListener('zoomend',()=>{
                   if(this.state.originChecked !== true){
                    this.removeMassMarker()
                   }                
                })      

                this.state.map.addEventListener('dragstart',()=>{

                    if(this.state.originChecked !== true){
                     this.removeMassMarker()
                    }                
                 })   
                 this.state.map.addEventListener('onmousedown',()=>{
                    if(this.state.originChecked !== true){
                     this.removeMassMarker()
                    }                
                 })   

                 this.state.map.addEventListener('onmouseup',()=>{
                    if(this.state.originChecked !== true){
                     this.removeMassMarker()
                    }                
                 })   

                this.setState({
                    nowBranchId:branchId,
                    nowDealmanId:dealmanId
                },()=>{
                    if(this.state.originChecked === true){
                        this.state.map.addOverlay(pointCollection);  // 添加Overlay
                        this.state.map.addOverlay(correctPointCollection);  // 添加Overlay
                    } 
                    if(this.state.fenceChecked === true){
                        this.getFenceData('1')
                    } 
                    if(this.state.collectPointChecked===true){
                        this.getFenceData('2')
                    }                  
                })

                }         
            })  

       }
        //查询围栏和代收点数据
        async getFenceData(type){
            let url = `branch/${this.state.nowBranchId}/dealman/${this.state.nowDealmanId}/fence`
            //let url = 'getFenceList.json'
            let data = {
                branchId:this.state.nowBranchId,
                dealmanId:this.state.nowDealmanId,
                mapType:'baidu'
            }
            let datas = await axios.get(
                { 
                url,
                data
            }) 
            let fenceObj = datas.data.range
            let collectPointObj = datas.data.collectpoints
            let keys = Object.keys(fenceObj)
            if(type==='1'){
                if(JSON.stringify(fenceObj)!=='{}'){
                    keys.forEach((val,key)=>{
                        let path =[]
                        let pointList = fenceObj[val]
                        for(let value of pointList){
                            let arr = value.split(',')
                            let arrlng = parseFloat(arr[0]).toFixed(6)
                            let arrlat = parseFloat(arr[1]).toFixed(6)
                            path.push(new window.BMap.Point(arrlng,arrlat))
                        }
                        let polygon = new window.BMap.Polygon(path,{
                            strokeColor: "#FF33FF",
                            strokeWeight: 2,
                            strokeOpacity: 0.5,
                            fillOpacity : 0.3,
                            fillColor: '#1791fc',
                        })
                        this.state.polygonList.push(polygon)
                        this.state.map.addOverlay(polygon)
                    });
                }            
            }else if(type==='2'){                
                let icon = new window.BMap.Icon(require('../../../../asset/images/collectPoint.png'),new window.BMap.Size(40, 50),{
                    imageSize: new window.BMap.Size(35, 35)   // 根据所设置的大小拉伸或压缩图片
                });
                if(collectPointObj.length>0){
                    collectPointObj.forEach(val=>{
                        let lnglat = val.lnglat
                    let marker = new window.BMap.Marker(new window.BMap.Point(lnglat[0],lnglat[1]),{
                        icon: icon, // 添加 Icon 图标 URL
                    });
                    marker.addEventListener('click',(e)=>{
                  
                        for(let i = 0; i < collectPointObj.length; i++){
                            console.log(collectPointObj[i])
                            if(e.target.point.lng==(collectPointObj[i].lnglat)[0] && e.target.point.lat==(collectPointObj[i].lnglat)[1]){
                                this.collectPointDetail(collectPointObj[i].name)
                                this.setState({
                                    isShow:true
                                })
                                break
                            }
                        }
                        return false;
                    })
                    this.state.markerArr.push(marker)
                    this.state.map.addOverlay(marker)
                    })
                }
            }
        }
        async deleteMailNo(){
            let url = `branch/${this.state.nowBranchId}/dealman/${this.state.nowDealmanId}/baidu/${this.state.nowSignTime}/${this.state.nowMailNo}`
            let datas = await axios.delete({
                url
            })
            return datas.data
        }

            //隐藏围栏
        removeFenceData(){
        this.state.polygonList.forEach((val)=>{
            this.state.map.removeOverlay(val)
            })
       }
            //隐藏代收点
        removeCollectPoint(){
            this.state.markerArr.forEach(val=>{
               this.state.map.removeOverlay(val)
            })
       }
       //隐藏海量点
       removeMassMarker(){
           console.log("qwer")
            let na = this.state.pointCollection.ia.na    
            // console.log(na)
            let correctNa = this.state.correctPointCollection.ia.na

            let b =this.state.pointCollection
            let correctB = this.state.correctPointCollection

            // this.state.pointCollection.remove()
            // this.state.correctPointCollection.remove()

            this.state.pointCollection.clear()
            this.state.correctPointCollection.clear()
            // this.state.map.removeOverlay(this.state.pointCollection)
            // this.state.map.removeOverlay(this.state.correctPointCollection)
            b.ia.na = na
            correctB.ia.na = correctNa
            this.setState({
                pointCollection:b,
                correctPointCollection:correctB,
            })
            
       }
       //展示海量点
       showMassMarker(){

        // let optionss = {
        //     color: '#34AAFC'
        // } 
        // let correctOptionss={
        //     color: '#FD6B0B'
        // }   
        // let savepointjh=new window.BMap.PointCollection(this.state.savepointjh, optionss)  
        // let savecorrectpointjh=new window.BMap.PointCollection(this.state.savecorrectpointjh, correctOptionss)  
           console.log("QW")
        // this.state.map.addOverlay(savepointjh);
        // this.state.map.addOverlay(savecorrectpointjh);

        this.state.map.addOverlay(this.state.pointCollection);
        this.state.map.addOverlay(this.state.correctPointCollection);
       }
       //关闭海量点详情模态框
       handleCancel=()=>{
           this.setState({
               isPoint:false
           })
       }

           //删除海量点
           handleDelete(){
            this.deleteMailNo().then((data)=>{
                if(!data){
                   Modal.info({
                        title:"提示",
                        content:"删除成功",
                        okText:"确定",
                        onOk:()=>{
                            this.setState({
                                visible:false,
                                isConfirm:false
                            })
                            this.props.getPointData('1')
                        }
                    })
                }
            })
    }
          //纠偏
        //   handleCorrect(){
        //     let lng = this.state.nowLnglat.split('，')[0]
        //     let lat = this.state.nowLnglat.split('，')[1]
        //     console.log(`${lng}++++${lat}`)
        //     let url = 'http://mapapi.yundasys.com:30019/addRessJPbaidu.html?address='+this.state.nowDetailObj.address+'?'+lng+'?'+lat+'?'+this.state.nowMailNo+'?baidu?'+this.state.nowSignTime+'?'+this.state.nowBranchId+'?'+this.state.nowDealmanId+'?'+this.state.nowDealmanName+'?'+this.state.nowBranchName
        //     //let url = 'http://mapapi.yundasys.com:30019/addRessJPbaidu.html?address='+encodeURIComponent(this.state.nowDetailObj.address)+'?'+lng+'?'+lat+'?'+this.state.nowMailNo+'?baidu?'+this.state.nowSignTime+'?'+this.state.nowBranchId+'?'+this.state.nowDealmanId+'?'+this.state.nowDealmanName+'?'+this.state.nowBranchName
        //     // let url = 'http://10.20.28.139:5500/addressPublic/addRessJPbaidu.html?address='+encodeURIComponent('#'+this.state.nowDetailObj.address)+'?'+lng+'?'+lat+'?'+this.state.nowMailNo+'?baidu?'+this.state.nowSignTime+'?'+this.state.nowBranchId+'?'+this.state.nowDealmanId+'?'+this.state.nowDealmanName+'?'+this.state.nowBranchName
           
        //     let win =  window.open(url,"jp")     
        //     let timmer = setInterval(() => {    
        //      if(win.closed === true){
        //          console.log('纠偏窗口关闭了')
        //          this.handleCancel()
        //          this.props.getPointData('1')
        //          clearInterval(timmer)         
        //      }
        //     }, 2000);
        //  }
    //签收点模态弹出
        lll = e => {
            this.handleCorrect()    
        }
    //代收点模态弹出
        kkk=e=>{
           this.setState({
            viisiblle: true,
            hasChildd:true,
           }) 
        }

        handleCorrect(){
            this.setState({
                visiblle: true,
                visible: false,
                isPoint:false,
                hasChild: true
              });
        }

        handleOkk = e => {
            this.setState({
              visiblle: false,
              viisiblle: false,
              hasChild: false,
              hasChildd: false,
            });
          };
        
          handleCancell = e => {
            this.setState({
              visiblle: false,
              viisiblle: false,
              hasChild: false,
              hasChildd: false,
            });
            let timmer = setInterval(() => { 
                     if(this.state.visiblle == false){
                         console.log('纠偏窗口关闭了')
                         this.handleCancel()
                         this.props.getPointData('1')
                         clearInterval(timmer)         
                     }
                    }, 2000);  
          };
       //取消确认框
       cancelConfirm(){
        this.setState({
            isConfirm:false
           })
    }
    // 
    changeFun(param){
        this.setState({
            fenceChecked:param.fenceChecked,
            collectPointChecked:param.collectPointChecked,
            originChecked:param.originChecked
        })
    }
    confirmDelete = e =>{
        this.setState({
         isConfirm:true
        })
     }
        //关闭详情框
        isClose(){
            this.setState({
                isShow:false
            })
        }

        isClosse(){
            this.setState({
                isPoint:false
            })
            let timmer = setInterval(() => {    
                this.state.map.removeOverlay(singlePoint);
                clearInterval(timmer)         
                    }, 1500); 
        }
       //查询代收点详情信息
       async collectPointDetail(name){

            let url = 'base/collectpoint'
            //let url = 'getCollectPointDetail.json'
            let data = {
                info:name,
                mapType:"baidu"
            }
            let datas = await axios.get({
                url,
                data
            })
            this.setState({
                collectPointDetailList:datas.data,
                collectLocation:datas.data[0].collectLocation,
                collectName:datas.data[0].collectName,
                collectType:datas.data[0].collectType,
                collectSourceName:datas.data[0].collectSourceName
            })
// collectLngLat collectName collectType collectSourceName
            console.log(121)
            console.log(datas.data)
            console.log(121)
       }
       //根据运单号查询订单详情 
       async queryMailnoDetail(mailNo){
    
           let url = 'base/track'
           let data = {
                mapType:'baidu',
                trackNo: mailNo
           }
           let datas = await axios.get({
            url,
            data
            })
           return datas.data
       }
       
       childValue = e => {
        this.setState({
            visiblle: false,
            hasChild: false
          });
          let timmer = setInterval(() => {    
            this.state.map.removeOverlay(singlePoint);
                   if(this.state.visiblle == false){
                       console.log('纠偏窗口关闭了')
                       this.handleCancel()
                       this.props.getPointData('1')
                       clearInterval(timmer)         
                   }
                  }, 2000);  
       }
    render(){
        console.log(11)
        return(
         
            <div style={{position:"relative"}}>
                <MapFunc getFenceData={this.getFenceData.bind(this)} 
                         removeFenceData={this.removeFenceData.bind(this)}
                         removeCollectPoint = {this.removeCollectPoint.bind(this)}
                         removeMassMarker = {this.removeMassMarker.bind(this)}
                         showMassMarker = {this.showMassMarker.bind(this)}
                         checkBoxReset={this.props.checkBoxReset}   
                         changeFun={this.changeFun.bind(this)}
                ></MapFunc>
                <div style={{width:"100%",height:"calc(71vh)"}} ref="container" className="container">
                </div>
                <InfoDetail kkk={this.kkk} collectPointDetailList={this.state.collectPointDetailList} isShow={this.state.isShow} isClose={this.isClose.bind(this)}></InfoDetail>
                <PointClick  lll={this.lll} confirmDelete={this.confirmDelete} handleCorrect={this.handleCorrect} nowDetailObj={this.state.nowDetailObj} nowSignNum={this.state.nowSignNum} nowSignTime={this.state.nowSignTime} nowLnglat={this.state.nowLnglat} nowMailNo={this.state.nowMailNo} isClosse={this.isClosse.bind(this)} isPoint={this.state.isPoint}></PointClick>

                {/* <ModalInfo
                    visible={this.state.visible}
                    title="信息" collectLocation collectLngLat collectName collectType collectSourceName
                    onCancel={this.handleCancel.bind(this)}
                    width="350px"
                    footer={[
                        <Button type="primary" key="1" onClick={this.handleCorrect.bind(this)}>
                        纠偏
                        </Button>,
                        <Button key="2" onClick={this.confirmDelete.bind(this)}>
                             删除
                        </Button>,
                        <Button key="3" onClick={this.handleCancel.bind(this)}>
                        取消
                        </Button>,                                         
                            ]}
                        >
                    <p>运单号：{this.state.nowMailNo}</p>
                    <p>经纬度：{this.state.nowLnglat}</p>
                    <p>签收时间：{this.state.nowSignTime}</p>
                    <p>签收次数：{this.state.nowSignNum}</p>
                    <p>原始地址：{this.state.nowDetailObj.address}</p>
                    <p>AOI名称：{this.state.nowDetailObj.aoiName}</p>
                    <p>AOI经纬度：{this.state.nowDetailObj.aoiLocation}</p>
                    <p>运单来源：{this.state.nowDetailObj.source}</p>

                </ModalInfo> */}
                <Modal
                        title={"原始地址:"+this.state.nowDetailObj.address+"....运单号:"+this.state.nowMailNo+"....签收时间:"+this.state.nowSignTime+"....网点ID:"+this.state.nowBranchId+"....业务员ID:"+this.state.nowDealmanId}
                        visible={this.state.visiblle}
                        onOk={this.handleOkk}
                        onCancel={this.handleCancell}
                        footer={null}
                        maskClosable={false}
                        style={{ top: 0 }}
                        wrapClassName={'web'}
                        width="100%"
                        zIndex = "10000000000000"
                      >
                    {  this.state.hasChild
                       ?<Baidu signTime={this.state.nowSignTime} nowMailNo={this.state.nowMailNo} branchId={this.state.nowBranchId} dealmanId={this.state.nowDealmanId} address={this.state.nowDetailObj.address} lnglat={this.state.nowLnglat} yundan={this.state.nowMailNo} time={this.state.nowSignTime} getChildValue={this.childValue}></Baidu>: null
                        }
                </Modal>
                <Modal
                        title={"位置：" +this.state.collectLocation+"。 名称："+this.state.collectName+"。 类型："+this.state.collectType+"。 来源："+this.state.collectSourceName}
                        visible={this.state.viisiblle}
                        onOk={this.handleOkk}
                        onCancel={this.handleCancell}
                        footer={null}
                        style={{ top: 0 }}
                        width="100%"
                        zIndex = "10000000000000"
                      >
                    {  this.state.hasChildd
                       ?<DsdPoint collectPointDetailList={this.state.collectPointDetailList}></DsdPoint>: null
                        }
                </Modal>
                <ModalInfo
                    title="确认提示"
                    visible={this.state.isConfirm}
                    onOk={this.handleDelete.bind(this)}
                    onCancel={this.cancelConfirm.bind(this)}
                    okText="确定"
                    cancelText="取消"
                >
                <p>你确定要删除当前坐标?</p>
                </ModalInfo>
            </div>
            )
    }

    componentDidMount(){
     this.renderMap(this.props.pointList)  
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            nowBranchId:nextProps.searchBranchId,
            nowDealmanId:nextProps.searchDealmanId,
            mailNodata:nextProps.mailNodata,
            pointSET:nextProps.pointSET
        })
        if(JSON.stringify(this.props.pointList)!==JSON.stringify(nextProps.pointList)){
            this.renderMap(nextProps.pointList)   
           }     
             //4301577855447
        this.state.map.addOverlay(nextProps.mailNodata);  // 添加Overlay
        // console.log(nextProps.pointSET[0])
    //   let poi = [new window.BMap.Point(nextProps.pointSET[0].lng,nextProps.pointSET[0].lat)]
        this.state.map.setViewport(nextProps.pointSET)
    }

}

export default Map