import React from 'react'
import '../css/AddDetail.scss'
import {Icon} from 'antd'
class AddDetailBD extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            geoData: '', // 传来的正经纬度
            mailNoData: '', // 传来的运单号
            addData: '', // 传来的地址
            aoiGeoData: '', // 传来的aoi经纬度
            geoMarker: '', // 根据经纬度生成的点标记
        };
    }
    //返回上一级页面
    return(){
        this.props.history.go(-1)
    }
    render(){
        return(
            <div>
                <div className='header'>
                    <span onClick={this.return.bind(this)}> <Icon type="left" /></span>                 
                    <span style={{color:"#231815",fontSize:"0.14rem",fontWeight:"bold",marginLeft:"0.2rem"}}>经纬度{this.state.geoData}</span>
                </div>         
                <div className="divider"></div>
                <div>
                    <div style={{width:"100%",height:545}} ref="container" className="container">
                    </div>
                </div> 
            </div>
        )     
    }
    componentDidMount() {
     let geoData = this.props.location.state.data.geoData
     let mailNoData= this.props.location.state.data.mailNoData
     let addData = this.props.location.state.data.addData
     let arr = geoData.split(',')
     let arrlng = parseFloat(arr[0]).toFixed(10)
     let arrlat = parseFloat(arr[1]).toFixed(10)
     let data = {arrlng,arrlat}
        this.setState({
            geoData,
            mailNoData,
            addData
        },()=>{
            this.renderMap(data)
        })
   }
   renderMap = (res) =>{
    const _this = this
    let content = _this.refs.container
    let marker = new window.BMap.Marker(new window.BMap.Point(res.arrlng,res.arrlat))
     //设置标签
     let opts = {
        position : new window.BMap.Point(res.arrlng,res.arrlat),    // 指定文本标注所在的地理位置
        offset   : new window.BMap.Size(30, -30)    //设置文本偏移量
    }
    let label =  new window.BMap.Label("<div class='info' style='height:0.4rem;width:1.4rem;color:white;font:0.12rem;padding: 3px 7px;position: relative;'>"+          
                                                "<p>运单号："+_this.state.mailNoData+"</P><p>地址："+_this.state.addData+"</P>"+
                                                "</div>", opts) // 创建文本标注对象
    marker.addEventListener('click',function(){
        marker.setLabel(label);
    })
    //  创建地图
    let map = new window.BMap.Map(content,{
        zoom:15
    })
    map.centerAndZoom(new window.BMap.Point(res.arrlng,res.arrlat), 15);     // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(); 
    map.addOverlay(marker);              // 将标注添加到地图中
   }
}

export default AddDetailBD