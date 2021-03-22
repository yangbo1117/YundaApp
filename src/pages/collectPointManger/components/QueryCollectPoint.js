import React from 'react'
import '../css/index.scss'
import { Select , Button,Input,Table} from 'antd'
import axios from '../../../axios'
import { DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
const { Option } = Select;
const InputGroup = Input.Group;
moment.locale('zh-cn');
class  QueryCollectPoint extends React.Component{
    constructor(props){
      super(props)
      this.state = {
        addressList: [], //返回的网点数据
        personList:[], // 查询返回的业务员列表
        amapData: [], //返回的高德地图数据
        baiduData: [], //返回的百度地图数据
        tencentData: [], //返回的腾讯地图数据
        amapPagination: {}, //高德的分页标识
        baiduPagination: {}, //百度的分页标识
        tencentPagination: {}, //腾讯的分页标识
        date: '',    //查询的运单号
        branchId:'', //网点id
        salemanId:'', //营业员
        frequency:'', //选择频次
    }
    }
    
    componentDidMount(){
      this.getTableList()
    }
    //修改营业点
    changeSalePoint(value) {
      this.setState({
        branchId:value
      })
    }
      //修改营业员数据
    changeSaleMan(value) {
      this.setState({
          salemanId:value
        })
      
    }
      //查询营业点数据
    searchSalePoint(value) {
      this.getAddressList(value)   
    }
      //查询营业员数据
    searchSaleMan() {
        this.getPersonList()
    }
      //修改频次的数据
    changeTime(value){
      this.setState({
        frequency: value
      })  
    }

      //地址输入框修改的change事件
    changeDate(value){
      this.setState({
        "date": value
      })  
    }
    async getTableList(){ //获取表格中的数据
      let url = 'getListPoint.json'
      //let url = 'es/info'
      let data = {
        aoiName:this.state.aoiName,
        geoAddress:this.state.geoAddress,
        mailNo:this.state.mailNo,
        provinceId:this.state.provinceId
      }
      let datas = await axios.get({
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
    // 重置输入框内容
    reset(){
        this.setState({
            branchId: '', 
            salemanId: '', 
            date: '',
            frequency: ''
        })
    }
    // 查询网点
    async getAddressList(name){
    /* let data ={
        branchName:name
    } */
    let datas = await axios.get(
        { 
            url:'getAddData.json',
        }) 
        this.setState({
        addressList:datas.data
    })
    }
    //查询营业员
    async getPersonList(){
    // let data = {
    //     branchId:this.state.branchId,
    //     dateTime:this.state.dateTime,
    //     mapType:this.state.mapType
    // }
    let datas = await axios.get(
        { 
            url:'getPersonData.json',
        }) 
        this.setState({
        personList:datas.data
    })
    }
    render(){
      const columns = [
        {
          title: '运单号',
          dataIndex: 'mailNo',
          align:'center',
          sorter:(a,b) => {
            console.log(parseFloat(a.mailNo))
            return parseFloat(a.mailNo) - parseFloat(b.mailNo)
          },
          sortDirections: ['descend', 'ascend'],
          width: '33%',
        },
        {
          title: '代收点编码',
          dataIndex: 'geoAddress',
          width: '33%',
          align:'center'
        },
        {
          title: '代收点类型',
          dataIndex: 'amapGeoLocation',
          align:'center',
          onCell: (record) => {
            return{
              onClick: (e) => {
                let mailNoData = e.target.parentNode.children[0].innerHTML;
                let addData = e.target.parentNode.children[1].innerHTML;
                let geoData = e.target.innerHTML;
                console.log(addData)
                this.props.history.push({ pathname: "/c/ab", state: { data:{
                    mailNoData,
                    geoData,
                    addData
                } } })
              }
            }   
          }
        }
    ];
        return(
        <div>
            <div className="searchHead">
                <InputGroup compact>
                    <Select
                        showSearch
                        style={{ width: '3.0rem' }}
                        placeholder="请选择网点"
                        onChange={this.changeSalePoint.bind(this)}
                        onSearch={this.searchSalePoint.bind(this)}
                        onBlur = {this.searchSaleMan.bind(this)}
                        filterOption={false}
                        value={this.state.branchId===''?undefined:this.state.branchId}
                    >
                    { this.state.addressList.map((item) =>
                          <Option value={item.value} key={item.id}>{item.name}</Option>
                    )}
                    </Select>
                    <Select
                        style={{ width: '1.7rem' }}
                        placeholder="请选择业务员"
                        onChange={this.changeSaleMan.bind(this)}
                        filterOption={false}
                        value={this.state.salemanId===''?undefined:this.state.salemanId}
                    >
                    { this.state.personList.map((item) =>
                      <Option value={item.value} key={item.id}>{item.name}</Option>
                    )}
                    </Select>
                    <DatePicker locale={locale} style={{ width: '1.7rem',marginLeft:'0.1rem' }} onChange={this.changeDate.bind(this)} value={this.state.date===''?undefined:this.state.date} placeholder="请选择日期" />
                    <Select
                        showSearch
                        style={{ width: '1.7rem',marginLeft:'0.1rem' }}
                        placeholder="请选择频次"
                        onChange={this.changeTime.bind(this)}
                        filterOption={false}
                        value={this.state.frequency===''?undefined:this.state.frequency}
                    >
                      { this.state.addressList.map((item) =>
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                        )}
                    </Select>           
                    <Button type="primary"  icon="search" onClick={this.getTableList.bind(this)}>查询</Button>
                    <Button className="reset" type="primary" ghost="true" icon="sync" onClick={this.reset.bind(this)}>重置</Button>
                </InputGroup> 
            </div>           
            <div className="divider"></div>
            <Table
              bordered
              columns={columns}
              rowKey={record=> record.mailNo}
              dataSource={this.state.amapData}
              pagination={this.state.amapPagination}
              onChange={this.handleTableChange}
            />              
        </div>
        )
    }
}
export default  QueryCollectPoint