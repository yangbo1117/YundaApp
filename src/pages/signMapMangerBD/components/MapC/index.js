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
        console.log(res)
        const _this = this
        let content = _this.refs.container 
        let path = []         
        //  创建地图
            this.setState({
                map:  new window.BMap.Map(content,{
                    zoom:10
                })
            },()=>{
                this.state.map.centerAndZoom(new window.BMap.Point(105.000, 38.000), 10);     // 初始化地图,设置中心点坐标和地图级别
                this.state.map.enableScrollWheelZoom(); 
                if(res.length!==0){
                    res.forEach((value) => {        
                        this.state.map.centerAndZoom(new window.BMap.Point(value.point.lng,value.point.lat), 15);      
                        path.push(new window.BMap.Point(value.point.lng,value.point.lat))
                    });
                    let polygon = new window.BMap.Polygon(path,{
                        strokeColor: "#00ABFA",
                        strokeWeight: 2,
                        strokeOpacity: 0.5,
                        fillOpacity : 0.3,
                        fillColor: '#1791fc',
                    })
                    this.state.map.addOverlay(polygon)
                }  
            })              
    } 
    render(){
        return(
            
                <div style={{width:"100%",height:545}} ref="container" className="container">
                </div>
            
        )
    }
    componentWillReceiveProps(nextProps){
        if(JSON.stringify(this.props.pointList)!==JSON.stringify(nextProps.pointList)){
            this.renderMap(nextProps.pointList)   
           }  
    }

}

export default Map