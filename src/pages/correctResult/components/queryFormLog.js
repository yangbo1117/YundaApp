import React from 'react'
import { Form,DatePicker, Row, Col, Input, Button, Icon } from 'antd';
const {  RangePicker } = DatePicker;
class QueryFormLog extends React.Component {
        constructor(props){
            super(props)
            this.state={
             
            }
        }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      let date = values.date
      let params
      if(date!==undefined){
        let createTimeStart = date[0].format('YYYY-MM-DD')
        let createTimeEnd = date[1].format('YYYY-MM-DD')
        params = {
            createTimeStart,
            createTimeEnd,
            formatAddress:values.formatAddress,
            createUser:values.createUser
          }
      }else{
        params = {
            updateTimeStart:'',
            updateTimeEnd:'',
            formatAddress:values.formatAddress,
            createUser:values.createUser
          } 
      }   
    
      this.props.search(params,{
          pageSize:'10',
          current:'1'
      })
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div>
             <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24}>
                    <Col span={6} key={1}>
                        <Form.Item label='标准化地址'>
                            {getFieldDecorator('formatAddress', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Input placeholder="标准化地址" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6} key={2}>
                        <Form.Item label='操作人'>
                            {getFieldDecorator('createUser', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Input placeholder="操作人" />)}
                        </Form.Item>
                    </Col>
                  {/*   <Col span={8}  key={2}>
                        <Form.Item label='纠偏前经纬度'>
                            {getFieldDecorator('lnglat', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Input placeholder="纠偏前经纬度" />)}
                        </Form.Item>
                    </Col> */}
                    <Col span={6} key={3}>
                    <Form.Item label="日期">
                        {getFieldDecorator('date', {
                            rules: [{ type: 'array', required: false, message: '必须输入!' }],
                        })(<RangePicker placeholder={['开始日期','结束日期']} />)}
                    </Form.Item>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
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
const Forms = Form.create({})(QueryFormLog);
export default Forms
