import React from 'react'
import '../css/index.scss'
import { Select , Button,Input,Table} from 'antd'
import axios from '../../../axios'
import { Tabs,Icon } from 'antd';
const { TabPane } = Tabs;
const { Option } = Select;
const InputGroup = Input.Group;

class  QueryAdd extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        addressListTotal:[],//总的省数据
        addressList: [], //返回的省份
        amapData: [], //返回的高德地图数据
        baiduData: [], //返回的百度地图数据
        tencentData: [], //返回的腾讯地图数据
        amapPagination: {}, //高德的分页标识
        baiduPagination: {}, //百度的分页标识
        tencentPagination: {}, //腾讯的分页标识
        aoiName: '', //查询AOI名称
        geoAddress: '', //查询地址
        mailNo: '',    //查询的运单号
        provinceId: '', //查询的区域
        activeKey:'1', //当前的地图类型  1高德，2百度，3腾讯
        amapDetailShow:false, //展示高德详情
        baiduDetailShow:false, //展示百度详情
        tmapDetailShow:false,// 展示腾讯详情
        tableShow:true,//展示表格
        mailNoData:'', //当前点击表格的订单号
        addData:'', //当前点击表格的地址
        geoData:'', //当前点击表格的经纬度
    }
    }
    
    componentDidMount(){
       this.getAddressList();
  
    }
    //select中的change事件切换区域
    changeArea(value) { 
      this.setState({
        "provinceId": value
      })
      }
      //select中的搜索
      searchArea(value){
          if(value){
            let list =this.state.addressListTotal.filter((item)=>{
              if(item.name.indexOf(value)!==-1){
                return item
              }
            })
            this.setState({
              addressList:list
            })
          }          
      }
    //运单号输入框修改的change事件
    changeBill(e){
      this.setState({
        "mailNo":e.target.value
      })
    }

      //AOI名称输入框修改的change事件
    changeAOI(e){
      this.setState({
        "aoiName": e.target.value
      })  
    }

      //地址输入框修改的change事件
    changeAdd(e){
      this.setState({
        "geoAddress": e.target.value
      })  
    }
    async getTableList(){ //获取表格中的数据
      //let url = 'getListPoint.json'
      let url = 'es/info'
      let data = {
        aoiName:this.state.aoiName,
        geoAddress:this.state.geoAddress,
        mailNo:this.state.mailNo,
        provinceId:this.state.provinceId
      }
      let datas = await axios.post({
        url,
        data
      });
      let amapPagination = { ...this.state.amapPagination };
      let baiduPagination = { ...this.state.amapPagination };
      let tencentPagination = { ...this.state.amapPagination };
      amapPagination.total = datas.data.amap.length;
      baiduPagination.total = datas.data.baidu.length;
      tencentPagination.total =datas.data.tencent.length;
      //将获取的百度数据进行映射
      let baiduList = datas.data.baidu.map(item=>{
        return{
          mailNo:item.mailNo,
          geoAddress:item.geoAddress,
          amapFormattedAddress:item.baiduFormattedAddress,
          amapGeoLocation:item.baiduLocation,
          amapAoiName:item.baiduAoiName,
          amapAoiLocation:item.baiduAoiLocation,
          amapGeoLevel:item.baiduLevel,
          geoSource:item.geoSource,
          batchTime:item.batchTime,
        }
      })
      //将获取的腾讯数据进行映射
      let tencentList = datas.data.tencent.map(item=>{
        return{
          mailNo:item.mailNo,
          geoAddress:item.geoAddress,
          amapFormattedAddress:item.tencentFormattedAddress,
          amapGeoLocation:item.tencentGeoLocation,
          amapAoiName:item.tencentAoiName,
          amapAoiLocation:item.tencentAoiLocation,
          amapGeoLevel:item.tencentGeoLevel,
          geoSource:item.geoSource,
          batchTime:item.batchTime,

        }
      })
      this.setState({
        amapData: datas.data.amap,
        baiduData: baiduList,
        tencentData: tencentList,
        amapPagination,
        baiduPagination,
        tencentPagination
      });
    }
    async getAddressList(){
        let datas = await axios.get(
            { 
              url:'base/province',
          }) 
          datas.data.unshift({"name":"全部","id":"all"})
          this.setState({
            addressList:datas.data,
            addressListTotal:datas.data
        })
      }
       //返回上一级页面
    return(){
      this.setState({
        amapDetailShow:false,
        tableShow:true,
        baiduDetailShow:false,
        tmapDetailShow:false
      })
  }
      amapDetailInit = (res) =>{
        const _this = this
        let content = _this.refs.container
        let marker = new window.AMap.Marker({
            position: new window.AMap.LngLat(res.arrlng,res.arrlat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            offset: new window.AMap.Pixel(-15, -15),
            title: ''
        })
     /*    marker.on('click',function(){
            marker.setLabel({
                offset: new window.AMap.Pixel(-65, -70),  //设置文本标注偏移量
                content: "<div class='info'><p>运单号："+_this.state.mailNoData+"</P><p>地址："+_this.state.addData+"</P></div>", //设置文本标注内容
               // direction: 'right' //设置文本标注方位
            });
        }) */
        //  创建地图
        let map = new window.AMap.Map(content,{
            resizeEnable:true,
            //mapStyle: 'amap://styles/dark',
            zoom:15, //地图层级
            center: [res.arrlng,res.arrlat], //初始地图中心点
        })
          map.add(marker)
        this.setState({
          tableShow:false,
          amapDetailShow:true,
          baiduDetailShow:false,
          tmapDetailShow:false
        })
       }
       baiduDetailInit=(res)=>{
        const _this = this
        let content = _this.refs.baiduContainer
        let marker = new window.BMap.Marker(new window.BMap.Point(res.arrlng,res.arrlat))
     /*     //设置标签
         let opts = {
            position : new window.BMap.Point(res.arrlng,res.arrlat),    // 指定文本标注所在的地理位置
            offset   : new window.BMap.Size(30, -30)    //设置文本偏移量
        }
        let label =  new window.BMap.Label("<div class='info' style='height:0.4rem;width:1.4rem;color:white;font:0.12rem;padding: 3px 7px;position: relative;'>"+          
                                                    "<p>运单号："+_this.state.mailNoData+"</P><p>地址："+_this.state.addData+"</P>"+
                                                    "</div>", opts) // 创建文本标注对象
        marker.addEventListener('click',function(){
            marker.setLabel(label);
        }) */
        //  创建地图
        
        this.setState({
          baiduDetailShow:true,
          tableShow:false,
          amapDetailShow:false,
          tmapDetailShow:false
        },()=>{
          let map = new window.BMap.Map(content,{
            zoom:15
        })
        console.log(map)
        map.centerAndZoom(new window.BMap.Point(res.arrlng,res.arrlat), 15);     // 初始化地图,设置中心点坐标和地图级别
        map.enableScrollWheelZoom(); 
        map.addOverlay(marker);              // 将标注添加到地图中 
        })    
       }
       //创建腾讯地图
       tmapDetailInit=(res)=>{
        const _this = this
        let content = _this.refs.tmapContainer
        let marker = new window.qq.maps.LatLng(res.arrlat,res.arrlng);
        //  创建地图       
        this.setState({
          baiduDetailShow:false,
          tableShow:false,
          amapDetailShow:false,
          tmapDetailShow:true
        },()=>{
          let map = new window.qq.maps.Map(content,{
            zoom:15,
            center:marker,
            zoomControl: false,
            panControl: false,
            mapTypeControl: false,
          })
          new window.qq.maps.Marker({
            position: marker,
            map: map
          });            // 将标注添加到地图中 
        })    
       }

    // 重置输入框内容
    reset(){
        this.setState({
            aoiName: '', 
            geoAddress: '', 
            mailNo: '',
            provinceId: ''
        })
    }
    getActiveKey(key){
      console.log(key)
      this.setState({
        activeKey:key
      })
    }
    render(){
      const columns = [
        {
          title: '运单号',
          dataIndex: 'mailNo',
          align:'center',
          width: '11%',
        },
        {
          title: '原始地址',
          dataIndex: 'geoAddress',
          width: '20%',
          align:'center'
        },
        {
          title: '结构化地址',
          dataIndex: 'amapFormattedAddress',
          width: '10%',
          align:'center'
        },
        {
          title: '正经纬度',
          dataIndex: 'amapGeoLocation',
          align:'center',
          width: '10%',
          onCell: (record) => {
            return{
              onClick: (e) => {
                let mailNoData = e.target.parentNode.children[0].innerHTML;
                let addData = e.target.parentNode.children[1].innerHTML;
                let geoData = e.target.innerHTML;
                this.setState({
                  mailNoData,
                  addData,
                  geoData
                },()=>{
                  if(this.state.activeKey==='2'){
                    let arr = geoData.split(',')
                    let arrlng = parseFloat(arr[0]).toFixed(10)
                    let arrlat = parseFloat(arr[1]).toFixed(10)
                    let data = {arrlng,arrlat}
                    this.baiduDetailInit(data)
                  }else if(this.state.activeKey==='1'){
                    let arr = geoData.split(',')
                    let arrlng = parseFloat(arr[0]).toFixed(6)
                    let arrlat = parseFloat(arr[1]).toFixed(6)
                    let data = {arrlng,arrlat}
                    this.amapDetailInit(data)
                  }else{
                    let arr = geoData.split(',')
                    let arrlng = parseFloat(arr[0]).toFixed(6)
                    let arrlat = parseFloat(arr[1]).toFixed(6)
                    let data = {arrlng,arrlat}
                    console.log(data)
                    this.tmapDetailInit(data)
                  }   
                })
                         
              }
            }   
          }
        },
        {
          title: 'AOI名称',
          dataIndex: 'amapAoiName',
          width: '10%',
          align:'center'
        },
        {
          title: 'AOI经纬度',
          dataIndex: 'amapAoiLocation',
          width: '10%',
          align:'center',
          onCell: (record) => {
            return{
              onClick: (e) => {
                let mailNoData = e.target.parentNode.children[0].innerHTML;
                let addData = e.target.parentNode.children[1].innerHTML;
                let geoData = e.target.innerHTML;
                this.setState({
                  mailNoData,
                  addData,
                  geoData
                },()=>{
                  if(this.state.activeKey==='2'){
                    let arr = geoData.split(',')
                    let arrlng = parseFloat(arr[0]).toFixed(10)
                    let arrlat = parseFloat(arr[1]).toFixed(10)
                    let data = {arrlng,arrlat}
                    this.baiduDetailInit(data)
                  }else if(this.state.activeKey==='1'){
                    let arr = geoData.split(',')
                    let arrlng = parseFloat(arr[0]).toFixed(6)
                    let arrlat = parseFloat(arr[1]).toFixed(6)
                    let data = {arrlng,arrlat}
                    this.amapDetailInit(data)
                  }else{
                    let arr = geoData.split(',')
                    let arrlng = parseFloat(arr[0]).toFixed(6)
                    let arrlat = parseFloat(arr[1]).toFixed(6)
                    let data = {arrlng,arrlat}
                    console.log(data)
                    this.tmapDetailInit(data)
                  }    
                })
                         
              }
            }   
          }
        },
        {
          title: '匹配级别',
          dataIndex: 'amapGeoLevel',
          width: '7%',
          align:'center'
        },
        {
          title: '数据来源',
          dataIndex: 'geoSource',
          width: '7%',
          align:'center'
        },
        {
            title: '批次时间',
            dataIndex: 'batchTime',
            align:'center',   
        }
    ];
        return(
        <div>
          <div id="queryAdd" style={{display:this.state.tableShow===true?'block':'none'}}>
              <div className="searchHead">
                  <InputGroup compact>
                      <Select
                          showSearch
                          style={{ width: '1.7rem' }}
                          placeholder="请选择区域"
                          onChange={this.changeArea.bind(this)}
                          onSearch={this.searchArea.bind(this)}
                          filterOption={false}
                          value={this.state.provinceId===''?undefined:this.state.provinceId}
                      >
                        { this.state.addressList.map((item) =>
                          <Option value={item.id} key={item.id}>{item.name}</Option>
                          )}
                      </Select>
                      <Input style={{ width: '1.7rem',marginLeft:'0.1rem' }} onChange={this.changeBill.bind(this)} value={this.state.mailNo===''?undefined:this.state.mailNo} placeholder="请输入运单号"/>
                      <Input style={{ width: '1.7rem',marginLeft:'0.1rem' }} onChange={this.changeAOI.bind(this)} value={this.state.aoiName===''?undefined:this.state.aoiName} placeholder="请输入AOI名称"/>
                      <Input style={{ width: '2.9rem',marginLeft:'0.1rem' }} onChange={this.changeAdd.bind(this)} value={this.state.geoAddress===''?undefined:this.state.geoAddress} placeholder="请输入查询地址"/>
                      <Button type="primary"  icon="search" onClick={this.getTableList.bind(this)}>查询</Button>
                      <Button className="reset" type="primary" ghost="true" icon="sync" onClick={this.reset.bind(this)}>重置</Button>
                  </InputGroup> 
              </div>           
              <div className="divider"></div>
              <Tabs defaultActiveKey="1" onChange={this.getActiveKey.bind(this)}>
                <TabPane tab="高德" key="1">
                    <div className="divider"></div>
                    <Table
                      bordered
                      columns={columns}
                      rowKey={(record,index)=> index}
                      dataSource={this.state.amapData}
                      pagination={this.state.amapPagination}
                      onChange={this.handleTableChange}
                      // title={() => 'Header'}
                    />
                </TabPane>
                <TabPane tab="百度" key="2">
                <div className="divider"></div>
                    <Table
                      bordered
                      // scroll={{x:100}}
                      columns={columns}
                      rowKey={(record,index)=> index}
                      dataSource={this.state.baiduData}
                      pagination={this.state.baiduPagination}
                      onChange={this.handleTableChange}
                    />
                </TabPane>
                <TabPane tab="腾讯" key="3">
                <div className="divider"></div>
                    <Table
                      bordered
                      columns={columns}
                      rowKey={(record,index)=> index}
                      dataSource={this.state.tencentData}
                      pagination={this.state.tencentPagination}
                      onChange={this.handleTableChange}
                    />
                </TabPane>
            </Tabs>
          </div>
             
            <div className="amapDetail" style={{display:this.state.amapDetailShow===true?'block':'none'}}>
                <div className='header'>
                    <span onClick={this.return.bind(this)}> <Icon type="left"/></span>                 
                    <span style={{color:"#231815",fontSize:"0.14rem",fontWeight:"bold",marginLeft:"0.2rem"}}>经纬度{this.state.geoData}</span>
                </div>         
                <div className="divider"></div>
                <div style={{marginTop:"15px"}}>
                    <div style={{width:"100%",height:"calc(75vh)"}} ref="container" className="container">
                    </div>
                </div> 
            </div>
            <div className="baiduDetail" style={{display:this.state.baiduDetailShow===true?'block':'none'}}>
                <div className='header'>
                    <span onClick={this.return.bind(this)}> <Icon type="left" /></span>                 
                    <span style={{color:"#231815",fontSize:"0.14rem",fontWeight:"bold",marginLeft:"0.2rem"}}>经纬度{this.state.geoData}</span>
                </div>         
                <div className="divider"></div>
                <div style={{marginTop:"15px"}}>
                    <div style={{width:"100%",height:"calc(75vh)"}} ref="baiduContainer" className="container">
                    </div>
                </div> 
            </div>
            <div className="tmapDetail" style={{display:this.state.tmapDetailShow===true?'block':'none'}}>
                <div className='header'>
                    <span onClick={this.return.bind(this)}> <Icon type="left" /></span>                 
                    <span style={{color:"#231815",fontSize:"0.14rem",fontWeight:"bold",marginLeft:"0.2rem"}}>经纬度{this.state.geoData}</span>
                </div>         
                <div className="divider"></div>
                <div style={{marginTop:"15px"}}>
                    <div style={{width:"100%",height:"calc(75vh)"}} ref="tmapContainer" className="container">
                    </div>
                </div> 
            </div>
        </div>
        )
    }
}
export default  QueryAdd