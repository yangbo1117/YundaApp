import React from 'react'
import { Select , Button, Input,Spin} from 'antd'
import './index.scss'
import MapLabel from './components/MapLabel/index.js'
import axios from '../../axios'
import MapA from './components/MapA'
import MapB from './components/MapB'
import MapC from './components/MapC'
import { DatePicker, Modal } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
const { Option } = Select;
moment.locale('zh-cn');
let singlePointy
class SignMap extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            addressList: [], // 查询返回的网点地址列表
            personList:[], // 查询返回的业务员列表
            mapTypes:'1', // type 1 为原始结果图, 2为抽稀结果图 3,为外围结果图
            pointList:[], //返回的原始结果图点列表
            branchId:'', //网点id
            branchName:'',//网点名称
            dateTime:'all', //查询日期，all查全部
            mapType:'baidu', //查询数据类型:amap高德|baidu百度|tencent腾讯
            dealmanId :'', //营业员编码
            dealmanName :'', //营业员名称
            signTime:'',//查询日期
            date:'all', //格式化后日期yyyymmdd
            checkBoxReset:1,
            ydh:'',
            mailNodata:'', //运单号查询出来的数据
            on:false,
            pointSET:''   //自适应点标注
        };
    }
    changeMap(type){
        this.setState({
            mapTypes:type
        })
    }
    //修改营业点
    changeSalePoint(value) {
        console.log(value)
       let branchobj =  this.state.addressList.filter((item)=>{
           if(item.value===value){
               return item
           }
       })
     this.setState({
        branchId:value,
        dealmanId:'',
        branchName:branchobj[0].name
     },()=>{
         this.getPersonList()
     })
       
    }
     //修改营业员数据
     changeSaleMan(value) {
        let personobj =  this.state.personList.filter((item)=>{
            if(item.value===value){
                return item
            }
        })
        this.setState({
            dealmanId :value,
            dealmanName:personobj[0].name

         })
       
    }
   //日期输入框修改的change事件
   changeDate (value,dateString){
    dateString = dateString.replace(/-/g,"")
    this.setState({
        signTime: value,
        date:dateString
    })  
}
    onOk(value){
        value = moment(value).format('YYYY-MM-DD')
    }
    //查询营业点数据
    searchSalePoint(value) {
        setTimeout(()=>{
            if(value){
                this.getAddressList(value)  
            }    
        },200)
        
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
            url = 'getSparseList.json'
        }else{
            url = 'getOuterList.json'
        }
         */
        
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
                // arrlng = parseFloat(arrlng).toFixed(6)
                // arrlat = parseFloat(arrlat).toFixed(6)
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
                    dealmanId:this.state.dealmanId,
                    branchName:this.state.branchName,
                    dealmanName:this.state.dealmanName,
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
                // arrlng = parseFloat(arrlng).toFixed(6)
                // arrlat = parseFloat(arrlat).toFixed(6)
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
            let pointList = list.map(item=>{
                let arr = item.split(',')
                let arrlng = arr[0]
                let arrlat = arr[1]
                // arrlng = parseFloat(arrlng).toFixed(6)
                // arrlat = parseFloat(arrlat).toFixed(6)
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

        let url = 'base/branch'
        let data ={
            branchName:name
        }
        let datas = await axios.post(
            { 
                url,
                data
            }) 
            this.setState({
            addressList:datas.data
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
            signTime:'',
            dealmanId :'',
            ydh:'',
            
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

    ydh(){

        this.state.pointList.map((item,index)=>{
            if(item.mailNo == this.state.ydh){
               var tt= this.state.pointList.slice(index,index+1)
               console.log(tt)
               let options ={
                        color: '#FF00FF'
                    }
                singlePointy=new window.BMap.PointCollection([new window.BMap.Point(tt[0].point.lng,tt[0].point.lat)], options)
              this.setState({
                  mailNodata:singlePointy,
                  on:true,
                  pointSET:[new window.BMap.Point(tt[0].point.lng,tt[0].point.lat)]
              })

            }
        })
        // 3102799887908
        // let t1 = setTimeout(()=>{
        //     if(this.state.on == false){
        //         Modal.confirm({
        //            title: '系统提示',
        //            content: '未搜索到此运单号！',
        //            mask:false,
        //            zIndex:111111111111111111,
        //            centered:true,
        //          }); 
        //          clearTimeout(t1)
        //          this.setState({
        //             on:true
        //         })
        // }
        // },500)
    }

    ydhChange = e =>{
        this.setState({
            ydh:e.target.value
        })
    }

    onChangee(value){
        console.log(`selected ${value}`);
    
        let personobj =  this.state.personList.filter((item)=>{
            if(item.value===value){
                return item
            }
        })
        this.setState({
            dealmanId :value,
            dealmanName:personobj[0].name
         })
      }

    render(){
        return(
            <div>
                <MapLabel changeMap={this.changeMap.bind(this)} getPointData={this.getPointData.bind(this)}></MapLabel>
                <div className="searchHead">
                <Select
                    showSearch
                    style={{ width: '2rem' }}
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
                    showSearch
                    placeholder="请选择业务员"
                    onChange={this.changeSaleMan.bind(this)}
                    optionFilterProp="children"
                    getPopupContainer={triggerNode => triggerNode.parentNode} 
                    // filterOption={false}
                    value={this.state.dealmanId ===''?undefined:this.state.dealmanId }
                >
                  { this.state.personList.map((item) =>
                    <Option value={item.value} key={item.id}>{item.name}-签收量{item.count}</Option>
                    )}
                </Select>
                <DatePicker locale={locale} style={{ width: '1.7rem',marginLeft:'0.1rem' }} onChange={this.changeDate.bind(this)} value={this.state.signTime===''?undefined:this.state.signTime} placeholder="请选择日期" onOk={this.onOk.bind(this)}/>
                <Input value={this.state.ydh} onChange={this.ydhChange} style={{width:"1.5rem",marginLeft:"10px"}}  placeholder="请输入运单号"/>
                <Button type="primary"  icon="search" onClick={this.search.bind(this)}>查询</Button>
                <Button type="primary" style={{marginLeft:"10px"}} onClick={this.ydh.bind(this)} >运单号搜索</Button>
                <Button className="reset" type="primary" ghost="true" icon="sync" onClick={this.reset.bind(this)}>重置</Button>
                </div>           
                <div className="divider"></div>
                <div>
                    {/* <div style={{width:"100%",height:545}} ref="container" className="container">
                    </div> */}
                    {this.state.mapTypes==='1'&&<MapA pointSET={this.state.pointSET} pointList={this.state.pointList} mailNodata={this.state.mailNodata}  checkBoxReset={this.state.checkBoxReset} getPointData={this.getPointData.bind(this)} searchBranchId={this.state.branchId} searchDealmanId={this.state.dealmanId}></MapA>}
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