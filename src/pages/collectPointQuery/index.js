import React from 'react'
import { Table,ConfigProvider,Icon } from 'antd';
import QueryForm from './components/queryForm.js'
import './css/collectPointQuery.scss'
import axios from '../../axios'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/locale/zh_CN';

moment.locale('zh-cn');
class CollectPointQuery extends React.Component {
        constructor(props){
            super(props)
            this.state={
                results:[], //查询结果
                cityId: '',
                collectCode:'',//后端需要的参数保存起来
                collectName: '',
                companyCode: '',
                companyName: '',
                provinceId: '',
                status: '',  
                on:false,
                pagination:{
                    total:0,
                    pageSize:'10',
                    current:'1'
                },
                mailNoData:'', //当前点击表格的订单号
                addData:'', //当前点击表格的地址
                geoData:'', //当前点击表格的经纬度
                baiduDetailShow:false,
                tableShow:true
            }
        }
        handleTableChange(pagination){
            const pager = { ...this.state.pagination };
            pager.current = pagination.current;
            this.setState({
            pagination: pager,
            });
            let params = {
                cityId: this.state.cityId,
                collectCode: this.state.collectCode,
                collectName: this.state.collectName,
                companyCode: this.state.companyCode,
                companyName: this.state.companyName,
                provinceId: this.state.provinceId,
                status: this.state.status,  
            }
            this.getTableList(params,{
                current:pagination.current,
                pageSize:pagination.pageSize
            })
            console.log(pagination)
        }
        //获取查询的列表
        async getTableList(params,pagination){
            let url = 'base/collectPointList'
            // let url = 'http://10.20.28.3:8060/tv/base/collectPointList'
            let data = {
                cityId: params.cityId,
                collectCode: params.collectCode,
                collectName: params.collectName,
                companyCode: params.companyCode,
                companyName: params.companyName,
                provinceId: params.provinceId,
                status: params.status,  
                page:pagination.current||this.state.pagination.current,
                size:pagination.pageSize||this.state.pagination.pageSize
            }
            let datas = await axios.post({
                url,
                data,
            })
            console.log(22)
            console.log(datas)
            console.log(22)
            this.setState({
                results:datas.data,
                cityId: params.cityId,
                collectCode: params.collectCode,
                collectName: params.collectName,
                companyCode: params.companyCode,
                companyName: params.companyName,
                provinceId: params.provinceId,
                status: params.status
            })
        }
        //获取数据总数量
        async getTotal(params,pagination){
            let url = 'base/collectPointCount' 
            // let url = 'http://10.20.28.3:8060/tv/base/collectPointCount' 
            let data = {
                cityId: params.cityId,
                collectCode: params.collectCode,
                collectName: params.collectName,
                companyCode: params.companyCode,
                companyName: params.companyName,
                provinceId: params.provinceId,
                status: params.status          
            }
        let datas = await axios.post({  
            url,
            data,
        })
        console.log("w")
        console.log(datas)
        console.log("w")
        this.setState({
            pagination:{
                ...this.state.pagination,
                total:datas.data
            }
        },()=>{
            console.log(this.state.pagination.total)
            this.getTableList(params,pagination)
        })
        }
        //查询
        search(params,pagination){
            this.getTotal(params,pagination)
        }

        //初始化百度

        baiduDetailInit=(res)=>{
            const _this = this
            let content = _this.refs.baiduContainer
            let marker = new window.BMap.Marker(new window.BMap.Point(res.arrlng,res.arrlat))

            this.setState({
              baiduDetailShow:true,
              tableShow:false,
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

           return(){
            this.setState({
              tableShow:true,
              baiduDetailShow:false,
            })
        }

        render() {
        const columns = [
            {
                title: '品牌名称/编号',
                dataIndex: 'companyName',
                align:'center',
                width: '8%',
                className:'column-money'
            },
            {
                title: '品牌类型',
                dataIndex: 'companyCode',
                width: '6%',
                align:'center',
                className:'column-money'
            },
            {
                title: '站点名称/编码',
                dataIndex: 'collectNameCode',
                width: '8%',
                align:'center',
                className:'column-money'
            },
            {
                title: '省',
                dataIndex: 'provinceId',
                width: '4%',
                align:'center',
                className:'column-money'
            },
            {
                title: '市',
                dataIndex: 'cityId',
                width: '4%',
                align:'center',
                className:'column-money'
            },
            {
                title: '区',
                dataIndex: 'countyId',
                width: '4%',
                align:'center',
                className:'column-money'
            },
            {
                title: '详细地址',
                dataIndex: 'street',
                width: '12%',
                align:'center',
                className:'column-money'
            },
            {
                title: '经纬度',
                dataIndex: 'collectLngLat',
                width: '8%',
                align:'center',
                className:'column-money',
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
                            let arr = geoData.split(',')
                            let arrlng = parseFloat(arr[0]).toFixed(10)
                            let arrlat = parseFloat(arr[1]).toFixed(10)
                            let data = {arrlng,arrlat}
                            this.baiduDetailInit(data)
                        })
                      }
                    }   
                  }
            },
            {
                title: '状态',
                dataIndex: '2',
                width: '3%',
                align:'center',
                className:'column-money'
            },
            {
                title: '管理人员/联系人电话/办公电话',
                dataIndex: 'contactPhone',
                width: '10%',
                align:'center',
                className:'column-money'
            },
            {
                title: '库存总量',
                dataIndex: '4',
                width: '7%',
                align:'center',
                className:'column-money'
            },
            {
                title: '需交价格',
                dataIndex: '5',
                width: '7%',
                align:'center',
                className:'column-money'
            },
            {
                title: '营业时间',
                dataIndex: 'serviceTime',
                width: '7%',
                align:'center',
                className:'column-money'
            },
            {
                title: '网点信息',
                dataIndex: '7',
                width: '6%',
                align:'center',
                className:'column-money'
            },
            {
                title: '更新时间',
                dataIndex: 'updatatime',
                //width: '6%',
                align:'center',
                className:'column-money'
            }
        ];
        return (
            <div>
                <div style={{display:this.state.tableShow===true?'block':'none'}}>
                <ConfigProvider locale={locale} >
                    <QueryForm search={this.search.bind(this)}></QueryForm>
                             
                <div className="divider"></div>
                <Table
                    scroll={{ x: 2200 }}
                    bordered
                    columns={columns}
                    rowKey={(record,index)=> index}
                    dataSource={this.state.results}
                    pagination={{
                        total:this.state.pagination.total,
                        showQuickJumper:true
                    }}
                    onChange={this.handleTableChange.bind(this)}
                />
                </ConfigProvider>
                </div>
                <div className="baiduDetail" style={{display:this.state.baiduDetailShow===true?'block':'none'}}>
                <div className='header'>
                    <span onClick={this.return.bind(this)}> <Icon type="left" /></span>                 
                    <span style={{color:"#231815",fontSize:"0.14rem",fontWeight:"bold",marginLeft:"0.2rem"}}>经纬度{this.state.geoData}</span>
                </div>         
                <div className="divider"></div>
                <div>
                    <div style={{width:"100%",height:"calc(70vh)"}} ref="baiduContainer" className="container">
                    </div>
                </div> 
            </div>
            </div>
            
        );
        }
}

export default CollectPointQuery
