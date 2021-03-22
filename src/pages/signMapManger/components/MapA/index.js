import React from 'react'
import './index.scss'
import '../../css/map.scss'
import MapFunc from '../MapFunc/index.js'
import axios from '../../../../axios'
import InfoDetail from '../InfoDetail/index.js'
import {Popconfirm, Modal, Button } from 'antd'
import ModalInfo from '../../../../components/ModelInfo'
class Map extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            map:'',
            markCluster:'',
            markerLis:[],
            markers:[],
            infoWindow:'',
            polygonList:[], //围栏实例数组
            markerArr : [], //代收点数组
            massMarkObj:'', //海量点实例
            collectPointDetailList:[], //代收点详情信息
            nowMailNo:'', //当前点击海量点的订单号
            nowLnglat:'', //当前点击海量点的经纬度
            nowSignTime:'', //当前点击海量点的签收时间
            nowSignNum:'', //当前海量点签收次数
            nowBranchId:'', //当前点击海量点的网点
            nowDealmanId:'', //当前点击海量点的业务员
            visible:false, //展示海量点的详情模态框
            nowDetailObj:{},//订单详情数据
            isShow:false, //点击展示详情
            isConfirm:false,
            fenceObj:{},// 围栏数据
            collectPointObj:[],//代收点
            fenceChecked:true,
            collectPointChecked:true,
            originChecked:true,
        }
    }
    renderMap = (res) =>{
        const _this = this
        let content = _this.refs.container
        let markerList = [] 
        //  创建地图
 
            this.setState({
                map: new window.AMap.Map(content,{
                    resizeEnable:true,
                    //mapStyle: 'amap://styles/dark',
                    zoom:15
                })
            },()=>{
                if(res.length!==0){
                    let branchId,dealmanId
                    res.forEach((value,index) => {
                        this.state.map.setCenter(new window.AMap.LngLat(value.point.lng, value.point.lat))
                        let markerCul = {
                            lnglat: [value.point.lng, value.point.lat], //点标记位置
                            mailNo: value.mailNo,
                            signNum:value.signNum,
                            batchTime:value.batchTime,
                            correctType:value.correctType,
                            branchId:value.branchId,
                            dealmanId:value.dealmanId,
                            id:index,
                            lngLatStr:value.point.lng+"，"+value.point.lat
                        }
                        markerList.push(markerCul)
                        branchId = value.branchId
                        dealmanId = value.dealmanId
                    });
                    
                   let massMarks = new window.AMap.MassMarks(markerList,{
                    opacity: 0.8,
                    cursor: 'pointer',
                    zIndex: 111,  // 海量点图层叠加的顺序
                    zooms: [3, 19],  // 在指定地图缩放级别范围内展示海量点图层
                    style:[{
                         url: require('../../../../asset/images/massPoint.png'),  // 图标地址
                        size: new window.AMap.Size(10,10),      // 图标大小
                        anchor: new window.AMap.Pixel(4,4) // 图标显示位置偏移量，基准点为图标左上角
                    }]  // 设置样式对象
                })
        
                let markerT = new window.AMap.Marker({content: ' ', map: this.state.map});
                massMarks.on('click',(e)=>{
                    this.queryMailnoDetail(e.data.mailNo).then((data)=>{
                        console.log(data)
                        markerT.setPosition(e.data.lnglat);
                        this.setState({
                            nowLnglat:e.data.lngLatStr,
                            nowMailNo:e.data.mailNo,
                            nowSignTime:e.data.batchTime,
                            nowSignNum:e.data.signNum,
                            nowDetailObj:data,
                            visible:true
                        })
                    })
                   
                });   
                massMarks.setMap(this.state.map);    
                this.setState({
                    massMarkObj:massMarks,
                    nowBranchId:branchId,
                    nowDealmanId:dealmanId
                },()=>{
                    if(this.state.fenceChecked === true){
                        this.getFenceData('1')
                    } 
                    if(this.state.collectPointChecked===true){
                        this.getFenceData('2')
                    }                  
                    if(this.state.originChecked===true){
                       this.showMassMarker()
                    }else{
                        this.removeMassMarker()
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
                mapType:'amap'
            }
            let datas = await axios.get(
                { 
                url,
                data
            }) 
            let fenceObj = datas.data.range
            let collectPointObj = datas.data.collectpoints
            this.setState({
                fenceObj,
                collectPointObj
            })
            let keys = Object.keys(fenceObj)
            if(type==='1'){
                console.log(JSON.stringify(fenceObj))
                if(JSON.stringify(fenceObj)!=='{}'){
                    keys.forEach((val,key)=>{
                        let path =[]
                        let pointList = fenceObj[val].split(',')
                        for(let value of pointList){
                            let arr = value.split('_')
                            let arrlng = parseFloat(arr[0]).toFixed(6)
                            let arrlat = parseFloat(arr[1]).toFixed(6)
                            path.push(new window.AMap.LngLat(arrlng,arrlat))
                        }
                        let polygon = new window.AMap.Polygon({
                            path: path,
                            strokeColor: "#FF33FF",
                            strokeWeight: 3,
                            strokeOpacity: 1,
                            fillOpacity: 0.1,
                            fillColor: '#1791fc',
                            zIndex: 999,
                            bubble:true
                        })
                        setTimeout(()=>{
                            this.state.map.add(polygon)
                        },100)
                       
                        this.state.polygonList.push(polygon)
                        
                    });
                }
               
            }else if(type==='2'){
                
                let icon = new window.AMap.Icon({
                    size: new window.AMap.Size(40, 50),    // 图标尺寸
                    image: require('../../../../asset/images/collectPoint.png'),  // Icon的图像
                    imageSize: new window.AMap.Size(35, 35)   // 根据所设置的大小拉伸或压缩图片
                });
                if(collectPointObj.length!==0){
                    collectPointObj.forEach(val=>{
                        let lnglat = val.lnglat
                        let name = val.name
                            
                    let marker = new window.AMap.Marker({
                        position: lnglat,
                        offset: new window.AMap.Pixel(-10, -10),
                        icon: icon, // 添加 Icon 图标 URL
                        name:name
                    });
                    marker.on('click',(context)=>{
                        this.collectPointDetail(context.target.B.name)
                        this.setState({
                            isShow:true
                        })
                    })
                    this.state.markerArr.push(marker)
                    })
                    setTimeout(() => {
                        this.state.map.add(this.state.markerArr)
                    },100);                  
                }
               
            }
        
        }
        async deleteMailNo(param){
            let data ={
                branchId :this.state.nowBranchId,
                dealmanId :this.state.nowDealmanId,
                mailNo :this.state.nowMailNo,
                mapType :'amap',
                signTime :this.state.nowSignTime,
            }
            let url = `branch/${this.state.nowBranchId}/dealman/${this.state.nowDealmanId}/amap/${this.state.nowSignTime}/${this.state.nowMailNo}`
            let datas = await axios.delete({
                url,
               // data
            })
            return datas.data
        }

            //隐藏围栏
        removeFenceData(){
        this.state.polygonList.forEach((val)=>{
            val.hide()
        })
       }
            //隐藏代收点
        removeCollectPoint(){
            this.state.markerArr.forEach(val=>{
                val.hide()
            })
       }
       //隐藏海量点
       removeMassMarker(){
           if(this.state.massMarkObj){
            this.state.massMarkObj.hide()
           }    
       }
       //展示海量点
       showMassMarker(){
           if(this.state.massMarkObj){
            this.state.massMarkObj.show()
           }
        
       }
        //关闭海量点详情模态框
        handleCancel(){
            this.setState({
                visible:false
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
                                console.log(2)
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
        handleCorrect(){
                
        }
        // 
        changeFun(param){
            this.setState({
                fenceChecked:param.fenceChecked,
                collectPointChecked:param.collectPointChecked,
                originChecked:param.originChecked,
            })
        }
        confirmDelete(){
           this.setState({
            isConfirm:true
           })
        }
        //取消确认框
        cancelConfirm(){
            this.setState({
                isConfirm:false
               })
        }
        //关闭详情框
        isClose(){
            this.setState({
                isShow:false
            })
        }
       //查询代收点详情信息
       async collectPointDetail(name){
           console.log(name)
            let url = 'base/collectpoint'
            //let url = 'getCollectPointDetail.json'
            let data = {
                info:name
            }
            let datas = await axios.get({
                url,
                data
            })
            this.setState({
                collectPointDetailList:datas.data
            })
       }
       //根据运单号查询订单详情
       async queryMailnoDetail(mailNo){
           let url = 'base/track'
           let data = {
                mapType:'amap',
                trackNo: mailNo
           }
           let datas = await axios.get({
            url,
            data
            })
           return datas.data
       }
    render(){
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
                <div style={{width:"100%",height:"calc(70vh)"}} ref="container" className="container">
                </div>
                <InfoDetail collectPointDetailList={this.state.collectPointDetailList} isShow={this.state.isShow} isClose={this.isClose.bind(this)}></InfoDetail>
                <ModalInfo
                    visible={this.state.visible}
                    title="信息"
                    onCancel={this.handleCancel.bind(this)}
                    width="350px"
                    footer={[
                       /*  <Button type="primary" key="1" onClick={this.handleCorrect.bind(this)}>
                        纠偏
                        </Button>, */
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
                </ModalInfo>
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
                {/* <iframe src={this.state.src}></iframe> */}
                {/* <Modal
                    visible={this.state.visible}
                    title="信息"
                    onCancel={this.handleCancel.bind(this)}
                    width="350px"
                    footer={[
                        <Button type="primary" key="1" onClick={this.handleCorrect.bind(this)} style={{width:"0.6rem"}}>
                        纠偏
                        </Button>,
                        <Popconfirm key="confirm"
                        title="你确定要删除当前坐标?"
                        onConfirm={this.handleDelete.bind(this)}
                        //onCancel={cancel}
                        okText="是"
                        cancelText="否"
                        >
                            <Button key="2" style={{width:"0.6rem"}}>
                            删除
                            </Button>
                        </Popconfirm>,
                        <Button key="3" onClick={this.handleCancel.bind(this)} style={{width:"0.6rem"}}>
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
               </Modal> */}
            </div>
        )
    }
    componentDidMount(){
   
     this.renderMap(this.props.pointList)     
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            nowBranchId:nextProps.searchBranchId,
            nowDealmanId:nextProps.searchDealmanId
        })
       if(JSON.stringify(this.props.pointList)!==JSON.stringify(nextProps.pointList)){
           console.log(nextProps)
        this.renderMap(nextProps.pointList)   
       }
                    
    }

}

export default Map