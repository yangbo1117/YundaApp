import React from 'react'
import { Table,ConfigProvider  } from 'antd';
import QueryForm from './components/queryForm'
import axios from '../../axios'
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/locale/zh_CN';
moment.locale('zh-cn');
class CorrectPointQuery extends React.Component {
        constructor(props){
            super(props)
            this.state={
                results:[], //查询结果
                formatAddress:'', // 标准化地址
                createTimeStart:'', // 开始日期
                createTimeEnd:'', // 结束日期
                pagination:{
                    total:0,
                    pageSize:'10',
                    current:'1'
                }
            }
        }
        //获取查询的列表
        async getTableList(params){
            let branchId = params.branchId
            let dealmanId = params.dealmanId
            let url = `branch/${branchId}/dealman/${dealmanId}/recommend-collect-points` 
            let data={
                frequencyDate:params.frequencyDate,
                frequencyTime:params.frequencyTime
            }    
            let datas = await axios.get({
                url,
                data,
            })
            let pagination = { ...this.state.pagination }
            pagination.total = datas.data.length
            this.setState({
                results:datas.data,
                pagination
            })
        }
        //查询
        search(params){
            this.getTableList(params)
        }
        render() {
        const columns = [
            {
                title: '运单号',
                dataIndex: 'shipId',
                align:'center',
                width: '11%',
                sorter:(a,b) => {
                    console.log(parseFloat(a.shipId))
                    return parseFloat(a.shipId) - parseFloat(b.shipId)
                  },
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: '代收点编码',
                dataIndex: 'collectCode',
                width: '15%',
                align:'center'
            },
            {
                title: '代收点类型',
                dataIndex: 'collectTypeCh',
                width: '15%',
                align:'center'
            }
        ];
        return (
            <div>
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
                />
                </ConfigProvider>
            </div>
        );
        }
}

export default CorrectPointQuery
