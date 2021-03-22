import React from 'react'
import { Table,ConfigProvider,Icon  } from 'antd';
import QueryForm from './components/queryFormLog.js'
import './css/correctResultQuery.scss'
import axios from '../../axios'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/locale/zh_CN';
moment.locale('zh-cn');
class CorrectResultLog extends React.Component {
        constructor(props){
            super(props)
            this.state={
                results:[], //查询结果
                formatAddress:'', // 标准化地址
                createTimeStart:'', // 开始日期
                createTimeEnd:'', // 结束日期
                amapDetailShow:false, //展示高德详情
                baiduDetailShow:false, //展示百度详情
                tableShow:true,//展示表格
                geoData:'', //当前点击表格的经纬度
                pagination:{
                    total:0,
                    pageSize:'10',
                    current:'1'
                }
            }
        }
        handleTableChange(pagination){
            const pager = { ...this.state.pagination };
            pager.current = pagination.current;
            this.setState({
            pagination: pager,
            });
            let params = {
                formatAddress:this.state.formatAddress,
                createTimeStart:this.state.createTimeStart,
                createTimeEnd:this.state.createTimeEnd,
            }
            this.getTableList(params,{
                current:pagination.current,
                pageSize:pagination.pageSize
            })
            console.log(pagination)
        }
        //获取查询的列表
        async getTableList(params,pagination){
            let url = 'base/deliveryAddressCorrectLogList'
            let data = {
                formatAddress:params.formatAddress,
                createTimeStart:params.createTimeStart,
                createUser:params.createUser,
                createTimeEnd:params.createTimeEnd,
                page:pagination.current||this.state.pagination.current,
                size:pagination.pageSize||this.state.pagination.pageSize
            }
            let datas = await axios.post({
                url,
                data,
            })
            this.setState({
                results:datas.data,
                formatAddress:params.formatAddress,
                createTimeStart:params.createTimeStart,
                createTimeEnd:params.createTimeEnd,
            })
        }
        //获取数据总数量
        async getTotal(params,pagination){
            let url = 'base/deliveryAddressCorrectLogCount'
            let data = {
                formatAddress:params.formatAddress,
                createTimeStart:params.createTimeStart,
                createTimeEnd:params.createTimeEnd,            
                createUser:params.createUser          
            }
        let datas = await axios.post({
            url,
            data,
        })
        console.log(datas)
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

            //展示百度地图对应点位置
            baiduDetailInit=(res)=>{
                const _this = this
                let content = _this.refs.baiduContainer
                let marker = new window.BMap.Marker(new window.BMap.Point(res.arrlng,res.arrlat))  
                this.setState({
                  baiduDetailShow:true,
                  tableShow:false,
                  amapDetailShow:false
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
            //展示高德对应点的位置
            amapDetailInit = (res) =>{
            const _this = this
            let content = _this.refs.container
            let marker = new window.AMap.Marker({
                position: new window.AMap.LngLat(res.arrlng,res.arrlat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                offset: new window.AMap.Pixel(-15, -15),
                title: ''
            })
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
                baiduDetailShow:false
            })
            }
                 //返回上一级页面
            return(){
                this.setState({
                amapDetailShow:false,
                tableShow:true,
                baiduDetailShow:false
                })
            }
        render() {
        const columns = [
            {
                title: '标准化地址',
                dataIndex: 'formatAddress',
                align:'center',
                width: '11%',
            },
            {
                title: '纠偏前经纬度（百度）',
                dataIndex: 'baiduLocalLnglatOld',
                width: '15%',
                align:'center',
                onCell: (record) => {
                    return{
                      onClick: (e) => {
                        let geoData = e.target.innerHTML;
                        this.setState({
                          geoData
                        },()=>{
                            let arr = geoData.split(',')
                            let arrlng = parseFloat(arr[0]).toFixed(6)
                            let arrlat = parseFloat(arr[1]).toFixed(6)
                            let data = {arrlng,arrlat}
                            this.baiduDetailInit(data)                     
                        })
                                 
                      }
                    }   
                  }
            },
            {
                title: '纠偏前经纬度（高德）',
                dataIndex: 'amapLocalLnglatOld',
                width: '15%',
                align:'center',
                onCell: (record) => {
                    return{
                      onClick: (e) => {
                        let geoData = e.target.innerHTML;
                        this.setState({
                          geoData
                        },()=>{                      
                            let arr = geoData.split(',')
                            let arrlng = parseFloat(arr[0]).toFixed(6)
                            let arrlat = parseFloat(arr[1]).toFixed(6)
                            let data = {arrlng,arrlat}
                            this.amapDetailInit(data)                          
                        })
                                 
                      }
                    }   
                  }
            },
            {
                title: '纠偏后经纬度（百度）',
                dataIndex: 'baiduLocalLnglatNew',
                width: '15%',
                align:'center',
                onCell: (record) => {
                    return{
                      onClick: (e) => {
                        let geoData = e.target.innerHTML;
                        this.setState({
                          geoData
                        },()=>{
                            let arr = geoData.split(',')
                            let arrlng = parseFloat(arr[0]).toFixed(6)
                            let arrlat = parseFloat(arr[1]).toFixed(6)
                            let data = {arrlng,arrlat}
                            this.baiduDetailInit(data)                     
                        })
                                 
                      }
                    }   
                  }
            },
            {
                title: '纠偏后经纬度（高德）',
                dataIndex: 'amapLocalLnglatNew',
                width: '15%',
                align:'center',
                onCell: (record) => {
                    return{
                      onClick: (e) => {
                        let geoData = e.target.innerHTML;
                        this.setState({
                          geoData
                        },()=>{                      
                            let arr = geoData.split(',')
                            let arrlng = parseFloat(arr[0]).toFixed(10)
                            let arrlat = parseFloat(arr[1]).toFixed(10)
                            let data = {arrlng,arrlat}
                            this.amapDetailInit(data)                          
                        })
                                 
                      }
                    }   
                  }
            },
            {
                title: '操作人',
                dataIndex: 'createUser',
                width: '10%',
                align:'center'
            },
            {
                title: '日期',
                dataIndex: 'createTime',
                width: '10%',
                align:'center'
            }
        ];
        return (
            <div>
                <div id="correctLog" style={{display:this.state.tableShow===true?'block':'none'}}>
                    <ConfigProvider locale={locale} >
                        <QueryForm search={this.search.bind(this)}></QueryForm>
                                
                    <div className="divider"></div>
                    <Table
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
                <div className="amapDetail" style={{display:this.state.amapDetailShow===true?'block':'none'}}>
                    <div className='header'>
                        <span onClick={this.return.bind(this)}> <Icon type="left"/></span>                 
                        <span style={{color:"#231815",fontSize:"0.14rem",fontWeight:"bold",marginLeft:"0.2rem"}}>经纬度{this.state.geoData}</span>
                    </div>         
                    <div className="divider"></div>
                    <div>
                        <div style={{width:"100%",height:"calc(70vh)"}} ref="container" className="container">
                        </div>
                    </div> 
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

export default CorrectResultLog
