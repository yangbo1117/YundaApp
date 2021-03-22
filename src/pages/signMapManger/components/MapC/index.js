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
        let path = []         
        //  创建地图
            this.setState({
                map: new window.AMap.Map(content,{
                    resizeEnable:true,
                    //mapStyle: 'amap://styles/dark',
                    zoom:15
                })
            },()=>{
                if(res.length!==0){
                    res.forEach((value) => {  
                        this.state.map.setCenter(new window.AMap.LngLat(value.point.lng, value.point.lat))           
                        path.push(new window.AMap.LngLat(value.point.lng,value.point.lat))
                    });
                    let polygon = new window.AMap.Polygon({
                        path: path,
                        strokeColor: "#00ABFA",
                        strokeWeight: 3,
                        strokeOpacity: 1,
                        fillOpacity: 0.1,
                        fillColor: '#1791fc',
                        zIndex: 50,
                    })
                        _this.state.map.add(polygon)      
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