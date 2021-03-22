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
        let points = []             
        //  创建地图
            this.setState({
                map:  new window.BMap.Map(content,{
                    zoom:10
                })
            },()=>{
                this.state.map.centerAndZoom(new window.BMap.Point(105.000, 38.000), 10);     // 初始化地图,设置中心点坐标和地图级别
                this.state.map.enableScrollWheelZoom(); 
                if(res.length!==0){
                    res.forEach((value,index) => {
                        this.state.map.centerAndZoom(new window.BMap.Point(value.point.lng,value.point.lat), 15); 
                        let point = new window.BMap.Point(value.point.lng,value.point.lat)
                        points.push(point)
                    });
                    let options = {
                        color: '#19E4B7'
                    }    
                    // 初始化PointCollection
                    let pointCollection=new window.BMap.PointCollection(points, options)         
                   //监听鼠标移入时事件
                    pointCollection.addEventListener('mouseover',(e)=>{
                      
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
                                                label:new window.BMap.Label("<div class='info' style='height:0.2rem;color:white;font:0.12rem;padding: 3px 7px;position: relative;'>"+          
                                                "<p>经纬度："+res[i].point.lng+','+res[i].point.lat+"</p>"+
                                                "</div>", opts) // 创建文本标注对象
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
                            
                                            break
                                        }
                                }                
              
                        }  
                      });  
                      //监听鼠标移出时事件
                      pointCollection.addEventListener('mouseout',()=>{
                        this.state.map.removeOverlay(this.state.label);
                      }); 
                        this.state.map.addOverlay(pointCollection);  // 添加Overlay
            
                        // this.state.map.setMapStyleV2({     
                        //     styleJson:styleJson
                        //   })
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