import React from 'react'
import { Select , Button} from 'antd'
import './index.scss'
import MapLabel from './components/MapLabel/index.js'
import axios from '../../axios'
import MapA from './components/MapA'
import MapB from './components/MapB'
import MapC from './components/MapC'
import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
const { Option } = Select;
moment.locale('zh-cn');
class SignMap extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            addressList: [], // 查询返回的网点地址列表
            personList:[], // 查询返回的业务员列表
            mapTypes:'1', // type 1 为原始结果图, 2为抽稀结果图 3,为外围结果图
            pointList:[], //返回的原始结果图点列表
            branchId:'', //网点id
            dateTime:'all', //查询日期，all查全部
            mapType:'amap', //查询数据类型:amap高德|baidu百度|tencent腾讯
            dealmanId :'', //营业员
            signTime:'',//查询日期
            date:'all',//格式化后日期yyymmdd
            checkBoxReset:1
        };
    }
    changeMap(type){
        this.setState({
            mapTypes:type
        })
    }
    //修改营业点
    changeSalePoint(value) {
     this.setState({
        branchId:value,
        dealmanId:''
     },()=>{
        this.getPersonList()
     })
       
    }
     //修改营业员数据
     changeSaleMan(value) {
        this.setState({
            dealmanId :value
         })
       
    }
    //查询营业点数据
    searchSalePoint(value) {
        setTimeout(()=>{
            if(value){
                this.getAddressList(value)  
            }    
        },200)  
    }
     //日期输入框修改的change事件
     changeDate(value,dateString){
        dateString = dateString.replace(/-/g,"")
        this.setState({
            signTime: value,
            date:dateString
        })  
    }
    onOk(value){
        value = moment(value).format('YYYY-MM-DD')
    }
    //业务员经纬度点数据
    async getPointData(type){
        let url=`branch/${this.state.branchId}/dealman/${this.state.dealmanId}`;
        let dataType   //dataType:'', //返回数据类型:all所有数据|raw原始签收数据|sparse抽稀|outer外围点
        if (type==='1'){
            dataType = 'raw'        
        }else if(type==='2'){
            dataType = 'sparse' 
        }else{
            dataType = 'outer'
        }
        let data = {
            signTime:this.state.date,
            dataType,
            mapType:this.state.mapType,
            branchId:this.state.branchId,
            dealmanId:this.state.dealmanId
        }
            
       /*  let url
        if (type==='1'){
                url = 'getListData.json' 
                   
        }else if(type==='2'){    
                url = 'getListData2.json'
        
        } */
        
        
        let datas = await axios.get(
            { 
                url,
               data
        })
        if(type==='1'){
            let list = datas.data.raw
            let pointList = list.map(item => {
                let arr = item.split(',')
                let arrlng = arr[0]
                let arr2 = arr[1].split('#')
                let arrlat = arr2[0]
                let mailNo = arr2[1] //订单号
                let correctType = arr2[2] //纠偏类型(1未纠偏|2已纠偏)
                let batchTime = arr2[3] //批次时间
                let signNum = arr2[4] //签收次数
                arrlng = parseFloat(arrlng).toFixed(6)
                arrlat = parseFloat(arrlat).toFixed(6)
                return{
                    point:{
                        lng:arrlng,
                        lat:arrlat
                    },
                    mailNo,
                    batchTime,
                    correctType,
                    signNum,
                    branchId:this.state.branchId,
                    dealmanId:this.state.dealmanId
                }
            });
            this.setState({
                pointList
            })
        }else if(type==='2'){
            let list = datas.data.sparse
            let pointList = list.map(item=>{
                let arr = item.split(',')
                let arrlng = arr[0]
                let arrlat = arr[1]
                arrlng = parseFloat(arrlng).toFixed(6)
                arrlat = parseFloat(arrlat).toFixed(6)
                return{
                    point:{
                        lng:arrlng,
                        lat:arrlat
                    }
                }
            })
            this.setState({
                pointList
            })
        }else{
            let list = datas.data.outer
            console.log(list)
            let pointList = list.map(item=>{
                let arr = item.split(',')
                let arrlng = arr[0]
                let arrlat = arr[1]
                arrlng = parseFloat(arrlng).toFixed(6)
                arrlat = parseFloat(arrlat).toFixed(6)
                return{
                    point:{
                        lng:arrlng,
                        lat:arrlat
                    }
                }
            })
            this.setState({
                pointList
            })
        }
      
    }
    // 查询营业点
    async getAddressList(name){
            let url ='base/branch'
            let data ={
                branchName:name
            }
            let datas = await axios.post(
                { 
                    url,
                    data
                }) 
                this.setState({
                addressList:datas.data,
            })   
    }
    //查询营业员
    async getPersonList(){
    let url = `base/branch/${this.state.branchId}/dealman`
    let data = {
        branchId:this.state.branchId,
        dateTime:this.state.dateTime,
        mapType:this.state.mapType
    }
    let datas = await axios.get(
        { 
            url,
            data
        }) 
        this.setState({
        personList:datas.data
    })
    }
    //重置输入框数据
    reset(){
        this.setState({
            branchId:'',
            dealmanId :''
        })
    }
    //查询点数据
    search(){
        let num = this.state.checkBoxReset+1
        this.setState({
            checkBoxReset:num
        })
        this.getPointData(this.state.mapTypes)
    }
    render(){
        return(
            <div>
                <MapLabel changeMap={this.changeMap.bind(this)} getPointData={this.getPointData.bind(this)}></MapLabel>
                <div className="searchHead">
                <Select
                    showSearch
                    style={{ width: '3.4rem' }}
                    placeholder="请选择网点"
                    onChange={this.changeSalePoint.bind(this)}
                    onSearch={this.searchSalePoint.bind(this)}
                    filterOption={false}
                    value={this.state.branchId===''?undefined:this.state.branchId}
                >
                    { this.state.addressList.map((item) =>
                    <Option value={item.value} key={item.id}>{item.name}</Option>
                    )}
                </Select>
                <Select
                    style={{ width: '2rem' }}
                    placeholder="请选择业务员"
                    onChange={this.changeSaleMan.bind(this)}
                    filterOption={false}
                    value={this.state.dealmanId ===''?undefined:this.state.dealmanId }
                >
                  { this.state.personList.map((item) =>
                    <Option value={item.value} key={item.id}>{item.name}-签收量{item.count}</Option>
                    )}
                </Select>
                <DatePicker locale={locale} style={{ width: '1.7rem',marginLeft:'0.1rem' }} onChange={this.changeDate.bind(this)} value={this.state.signTime===''?undefined:this.state.signTime} placeholder="请选择日期" onOk={this.onOk.bind(this)}/>
                <Button type="primary"  icon="search" onClick={this.search.bind(this)}>查询</Button>
                <Button className="reset" type="primary" ghost="true" icon="sync" onClick={this.reset.bind(this)}>重置</Button>
                </div>           
                <div className="divider"></div>
                <div>
                    {/* <div style={{width:"100%",height:545}} ref="container" className="container">
                    </div> */}
                    {this.state.mapTypes==='1'&&<MapA pointList={this.state.pointList} checkBoxReset={this.state.checkBoxReset} getPointData={this.getPointData.bind(this)} searchBranchId={this.state.branchId} searchDealmanId={this.state.dealmanId}></MapA>}
                    {this.state.mapTypes==='2'&&<MapB pointList={this.state.pointList}></MapB>}
                    {this.state.mapTypes==='3'&&<MapC pointList={this.state.pointList}></MapC>}
                </div> 
            </div>
        )     
    }
    componentDidMount() {
       
   }
}

export default SignMap