import React from 'react'
import { Select , Button,Input,Table} from 'antd'
import './index.scss'
import axios from '../../axios'
const { Option } = Select;
const InputGroup = Input.Group;

const columns = [
    {
      title: '运单号',
      dataIndex: 'amapAoiName',
      sorter:true,
      width: '50%',
      align:'center'
    },
    {
      title: '地址签收经纬度',
      dataIndex: 'amapAoiLocation',
      sorter:true,
      align:'center'
    }
];
class SignData extends React.Component{

    constructor(props){
      super(props)
      this.state = {
        addressList: [], //返回的省份
        personList: [], //返回的省份
        geoAddress: "", //查询地址
        mailNo: "",    //查询的运单号
        provinceId: "", //查询的区域
        tableList:[], //查询返回的签收点数据
        pagination:'' // 页码
    }
    }

    componentDidMount(){
      this.getAddressList();
     // this.getTableList('getListPoint.json')
   }
   //select中的change事件切换区域
   changeSalePoint(value) { 
     this.setState({
       "provinceId": value
     })
     }
    //select中的change事件切换区域
   changeSaleman(value) { 
    this.setState({
      "provinceId": value
    })
    }
   //运单号输入框修改的change事件
   changeBill(e){
     console.log(e.target.value)
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
   async querytableList(){ //获取表格中的数据
     let url = 'es/info'
     let data = {
      addressList: [], // 查询返回的地址列表
      personList:[], // 查询返回的业务员列表
       aoiName:this.state.aoiName,
       geoAddress:this.state.geoAddress,
       mailNo:this.state.mailNo,
       provinceId:this.state.provinceId
     }
     let datas = await axios.get({
       url,
       data
     });
     let pagination = { ...this.state.pagination };
     pagination.total = datas.data.amap.length;
     this.setState({
       amapData: datas.data.amap,
       pagination
     });
   }
   async getAddressList(){
       let datas = await axios.get(
           { 
             url:'base/province',
         }) 
         this.setState({
           addressList:datas.data
       })
     }
    render(){
        return(
        <div>
            <div className="searchHead">
                <InputGroup compact>
                <Select
                    showSearch
                    style={{ width: '3.4rem' }}
                    placeholder="请选择营业点"
                    onChange={this.changeSalePoint.bind(this)}
                    //onSearch={this.onSearch.bind(this,'1')}
                    filterOption={false}
                >
                    {this.state.addressList.map((item,index) =>
                    <Option value={item.address} key={index}>{item.address}</Option>
                    )}
                </Select>
                <Select
                    showSearch
                    style={{ width: '2rem' }}
                    placeholder="请选择业务员"
                    onChange={this.changeSaleman.bind(this)}
                   // onSearch={this.onSearch.bind(this,'2')}
                    filterOption={false}
                >
                  {this.state.personList.map((item,index) =>
                    <Option value={item.name} key={index}>{item.name}</Option>
                    )}
                </Select>
                    <Input style={{ width: '3.0rem',marginLeft:'0.1rem' }} onChange={this.changeAdd.bind(this)} value={this.state.geoAddress} placeholder="请输入查询的经纬度"/>
                    <Button type="primary"  icon="search" onClick={this.querytableList.bind(this)}>查询</Button>
                    <Button className="reset" type="primary" ghost="true" icon="sync">重置</Button>
                </InputGroup> 
            </div>           
            <div className="divider"></div>
            <Table
                      bordered
                      columns={columns}
                      rowKey={record=> record.mailNo}
                      dataSource={this.state.tableList}
                      pagination={this.state.pagination}
                      onChange={this.handleTableChange}
                    />
        </div>
        )
    }
}

export default SignData
