import React from 'react'
import { Form,DatePicker, Row, Col, Input, Button, Icon,Select } from 'antd';
import axios from '../../../axios'
import moment from 'moment';
const { Option } = Select;

class QueryForm extends React.Component {
        constructor(props){
            super(props)
            this.state={
                results:[], //查询结果
                pagination:1,
                addressList:[],
                personList:[],
                dealmanId:'', //营业员id
                branchId:'',  //网点id
                mapType:'baidu'
            }
        }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if(!err){
            console.log('Received values of form: ', values);
            let frequencyDate = values.frequencyDate
            let params
            if(frequencyDate!==undefined){
              frequencyDate = frequencyDate.format('YYYY-MM-DD')
              params={
                  branchId:values.branchId,
                  dealmanId:values.dealmanId,
                  frequencyTime :values.frequencyTime,
                  frequencyDate
                }
            }else{
              params={
                  branchId:values.branchId,
                  dealmanId:values.dealmanId,
                  frequencyTime :values.frequencyTime,
                  frequencyDate:''
                } 
            }
           
            this.props.search(params)
        }

    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };
   //查询营业点数据
   searchSalePoint(value) {
       console.log(value)
    setTimeout(()=>{
        if(value){
            this.getAddressList(value)  
        }    
    },200)  
  }
  //修改营业点
  changeSalePoint(value) {
    this.props.form.setFieldsValue({
        dealmanId:''
    })
    this.setState({
       branchId:value,     
    },()=>{
      this.getPersonList()
    })
      
   }
   //查询营业员
   async getPersonList(){
    let url = `base/branch/${this.state.branchId}/dealman`
    let data = {
        branchId:this.state.branchId,
        dateTime:'all',
        mapType:this.state.mapType
    }
    let datas = await axios.get(
        { 
            url,
            data,
        }) 
        this.setState({
        personList:datas.data
    })
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
                data,
            }) 
            this.setState({
            addressList:datas.data,
        })   
     /*    this.setState({
            addressList:[{id:'123',name:'赵巷',value:'123'},{id:'456',name:'青浦',value:'456'}]
        })  */
    }
  render() {
    const { getFieldDecorator } = this.props.form;
    const frequencyList=[
            {
                name:'第1次收派',
                value:'1'
            },
            {
                name:'第2次收派',
                value:'2'
            },
            {
                name:'第3次收派',
                value:'3'
            },
            {
                name:'第4次收派',
                value:'4'
            },
            {
                name:'第5次收派',
                value:'5'
            },
            {
                name:'第6次收派',
                value:'6'
            },
            {
                name:'第7次收派',
                value:'7'
            },
            {
                name:'第8次收派',
                value:'8'
            }
    ]
    return (
        <div>
             <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24}>
                    <Col span={6} key={1}>
                        <Form.Item label='网点'>
                            {getFieldDecorator('branchId', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Select
                                showSearch
                                placeholder="请选择网点"
                                onChange={this.changeSalePoint.bind(this)}
                                onSearch={this.searchSalePoint.bind(this)}
                                filterOption={false}
                            >
                                { this.state.addressList.map((item) =>
                                <Option value={item.value} key={item.id}>{item.name}</Option>
                                )}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  key={2}>
                        <Form.Item label='营业员'>
                            {getFieldDecorator('dealmanId', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Select
                                placeholder="请选择营业员"
                                filterOption={false}
                            >
                              { this.state.personList.map((item) =>
                                <Option value={item.value} key={item.id}>{item.name}-签收量{item.count}</Option>
                                )}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  key={3}>
                        <Form.Item label='频次'>
                            {getFieldDecorator('frequencyTime', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Select
                                placeholder="请选择频次"
                                filterOption={false}
                            >
                              { frequencyList.map((item) =>
                                <Option value={item.value} key={item.value}>{item.name}</Option>
                                )}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={6} key={4}>
                        <Form.Item label="日期">
                            {getFieldDecorator('frequencyDate', {
                                rules: [
                                    {
                                    required: false,
                                    message: '必须输入!',
                                    },
                                ],
                                initialValue: moment(new Date().toLocaleDateString(), 'YYYY-MM-DD')
                            })(<DatePicker placeholder="请选择日期"/>)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" icon="search" htmlType="submit">
                        查询
                        </Button>
                        <Button className="reset" style={{ marginLeft: 8 }} type="primary" ghost="true" icon="sync" onClick={this.handleReset}>
                        重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
     
    );
  }
}
const Forms = Form.create({})(QueryForm);
export default Forms
