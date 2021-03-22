import React from 'react'
import '../css/CollectPointDetail.scss'
import {Icon} from 'antd'
class AddDetail extends React.Component{
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
        this.setState({
            geoData,
            mailNoData,
            addData
        })
      let arr = geoData.split(',')
      let arrlng = parseFloat(arr[0]).toFixed(10)
      let arrlat = parseFloat(arr[1]).toFixed(10)
      let data = {arrlng,arrlat}
      this.renderMap(data)

   }
   renderMap = (res) =>{
       console.log(res)
    const _this = this
    let content = _this.refs.container
    let marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(res.arrlng,res.arrlat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        offset: new window.AMap.Pixel(-15, -15),
        title: ''
    })
    map.add(marker)
    marker.on('click',function(){
        marker.setLabel({
            offset: new window.AMap.Pixel(-65, -70),  //设置文本标注偏移量
            content: "<div class='info'><p>运单号："+_this.state.mailNoData+"</P><p>地址："+_this.state.addData+"</P></div>", //设置文本标注内容
           // direction: 'right' //设置文本标注方位
        });
    })
    //  创建地图
    let map = new window.AMap.Map(content,{
        resizeEnable:true,
        mapStyle: 'amap://styles/dark',
        zoom:15, //地图层级
        center: [res.arrlng,res.arrlat], //初始地图中心点
    })
     

   }
}

export default AddDetail