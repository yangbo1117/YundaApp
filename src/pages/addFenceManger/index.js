import React from 'react'
import { Select , Button} from 'antd'
import './index.scss'
import axios from '../../axios'
const { Option } = Select;

class AddFence extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            addressList: [], // 查询返回的地址列表
            personList:[], // 查询返回的业务员列表
            pointList:[] //返回的点列表
    
        };
    }
    changeMap(type){
        console.log(type)
        this.setState({
            mapType:type
        })
    }
    onChange(type,value) {
        if(type==='1'){
            this.setState({
                addressList: []
            })
        }else{
            this.setState({
                personList: []
            }) 
        }
       
      }
      onSearch(type,val) {
          if(type==='1'){
            this.getAddressList(val)
          }else{
            this.getPersonList(val)
          }
       
      }
      async getPointData(type){
          let url;
          if (type==='1'){
              url = 'getListData.json'
          }else{
              url = 'getListDataB.json'
          }
          let datas = await axios.get(
              { 
                url
              })
            console.log(datas)
            this.setState({
                pointList:datas
            })
           this.renderMap(datas)
      }
      async getAddressList(){
        let datas = await axios.get(
            { 
              url:'getAddData.json',
           }) 
          this.setState({
            addressList:datas.LIST
        })
      }
      async getPersonList(){
        let datas = await axios.get(
            { 
              url:'getPersonData.json',
          }) 
          this.setState({
            personList:datas.LIST
        })
      }
    render(){
        return(
            <div>
                <div className="searchHead">
                <Select
                    showSearch
                    style={{ width: '3.4rem' }}
                    placeholder="请选择营业点"
                    onChange={this.onChange.bind(this,'1')}
                    onSearch={this.onSearch.bind(this,'1')}
                    filterOption={false}
                >
                    { this.state.addressList.map((item,index) =>
                    <Option value={item.address} key={index}>{item.address}</Option>
                    )}
                </Select>
                <Select
                    showSearch
                    style={{ width: '2rem' }}
                    placeholder="请选择业务员"
                    onChange={this.onChange.bind(this,'2')}
                    onSearch={this.onSearch.bind(this,'2')}
                    filterOption={false}
                >
                  { this.state.personList.map((item,index) =>
                    <Option value={item.name} key={index}>{item.name}</Option>
                    )}
                </Select>
                <Button type="primary"  icon="search" >查询</Button>
                <Button className="reset" type="primary" ghost="true" icon="sync">重置</Button>
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
       this.getPointData('1')
   }
   renderMap = (res) =>{
    const _this = this
    let content = _this.refs.container
    let markerList = []
    let markers = []
    if(res.List.length!==0){
        res.List.forEach((value,index) => {
            let markerCul = {
                lnglat: [value.lng, value.lat], //点标记位置
                name: index+"测试测试测试测试测试",
                id:index
            }
            let marker = new window.AMap.Marker({
                position: new window.AMap.LngLat(value.lng, value.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                content: '<div style="display:none"></div>',
                offset: new window.AMap.Pixel(-15, -15),
                title: ''
            })
            markerList.push(markerCul)
            markers.push(marker)
        });
    }
  
    //  创建地图
    let map = new window.AMap.Map(content,{
        resizeEnable:true,
        mapStyle: 'amap://styles/dark',
        zoom:15
    })
       
    let massMarks = new window.AMap.MassMarks(markerList,{
        zIndex: 5,  // 海量点图层叠加的顺序
        zooms: [3, 19],  // 在指定地图缩放级别范围内展示海量点图层
        style:[{
            url: 'http://a.amap.com/jsapi_demos/static/images/mass2.png',  // 图标地址
            size: new window.AMap.Size(10,10),      // 图标大小
            anchor: new window.AMap.Pixel(4,4) // 图标显示位置偏移量，基准点为图标左上角
        }]  // 设置样式对象
    });
    let markerT = new window.AMap.Marker({content: ' ', map: map});
    massMarks.on('mouseover', function (e) {
        markerT.setPosition(e.data.lnglat);
        markerT.setLabel({
            offset: new window.AMap.Pixel(-70, -10),  //设置文本标注偏移量
            content: "<div style=' width: 150px;background: #fff;border-radius: 3px; padding: 3px 7px;position: relative;'>"+e.data.name+"</div>", //设置文本标注内容
        })
    });
    massMarks.on('mouseout', function(){
        markerT.setLabel(null);
    });
    //massMarks.setData(markerList);
    // 将海量点添加至地图实例
     //地图绑定鼠标右击事件——弹出右键菜单

     
    //右键添加菜单
    let contextMenu = new window.AMap.ContextMenu();
    contextMenu.addItem("放大一级", function () {
        //map.zoomIn();
        let add = "上海市"
        let w = window.open('about:blank');
        w.location.href="http://10.19.161.222/adsCorrect/addRessJP.html?address="+add
    }, 0);
    massMarks.on('click', function (e) {
         console.log(e.data.lnglat)
        contextMenu.open(map, e.data.lnglat);
        let contextMenuPositon = e.data.lnglat;
        });
    massMarks.setMap(map); 
    //将点进行聚合
    map.plugin(["AMap.MarkerClusterer"],function() {
       let  cluster = new window.AMap.MarkerClusterer(
        map,     // 地图实例
        markers,    // 海量点组成的数组
        {
            minClusterSize:8,
            gridSize: 80,
            style:[{
                url: "https://a.amap.com/jsapi_demos/static/images/blue.png",
                size: new window.AMap.Size(32, 32),
                offset: new window.AMap.Pixel(-16, -16)
            }]
        });
    });

   }
}

export default AddFence