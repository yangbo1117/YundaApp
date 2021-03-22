import React from 'react'
import '../../css/map.scss'
class Map extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            map:'',
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
                    res.forEach((value,index) => {
                        this.state.map.setCenter(new window.AMap.LngLat(value.point.lng, value.point.lat))
                        let markerCul = {
                            lnglat: [value.point.lng, value.point.lat], //点标记位置
                            id:index
                        }
                        markerList.push(markerCul)
                    });
                    let massMarks = new window.AMap.MassMarks(markerList,{
                        zIndex: 5,  // 海量点图层叠加的顺序
                        zooms: [3, 19],  // 在指定地图缩放级别范围内展示海量点图层
                        style:[{
                            url: 'http://a.amap.com/jsapi_demos/static/images/mass2.png',  // 图标地址
                            size: new window.AMap.Size(10,10),      // 图标大小
                            anchor: new window.AMap.Pixel(4,4) // 图标显示位置偏移量，基准点为图标左上角
                        }]  // 设置样式对象
                    });
                    let markerT = new window.AMap.Marker({content: ' ', map: this.state.map});
                    massMarks.on('mouseover', function (e) {
                        markerT.setPosition(e.data.lnglat);
                        markerT.setLabel({
                            offset: new window.AMap.Pixel(-80, -20),  //设置文本标注偏移量
                            content: "<div class='info' style='height:0.2rem;color:white;font:0.12rem;padding: 3px 7px;position: relative;'>"+          
                            "<p>经纬度："+e.data.lnglat+"</p>"+
                            "</div>", //设置文本标注内容
                        })
                    });
                    massMarks.on('mouseout', function(){
                        markerT.setLabel(null);
                    });
                    massMarks.setMap(this.state.map); 
                }         
           
            })
     
       }
    render(){
        return(
            
                <div style={{width:"100%",height:545}} ref="container" className="container">
                </div>
            
        )
    }
    componentDidMount(){
     this.renderMap(this.props.pointList)     
    }
    componentWillReceiveProps(nextProps){
        if(JSON.stringify(this.props.pointList)!==JSON.stringify(nextProps.pointList)){
            this.renderMap(nextProps.pointList)   
           } 
    }

}

export default Map