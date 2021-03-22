import React from 'react'
import { Form,DatePicker, Row, Col, Input, Button, Icon } from 'antd';
const {  RangePicker } = DatePicker;
class QueryForm extends React.Component {
        constructor(props){
            super(props)
            this.state={
                pagination:1
            }
        }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      let date = values.date
      let params
      if(date!==undefined){
        let updateTimeStart = date[0].format('YYYY-MM-DD')
        let updateTimeEnd = date[1].format('YYYY-MM-DD')
        params = {
            updateTimeStart,
            updateTimeEnd,
            formatAddress:values.formatAddress
          }
      }else{
        params = {
            updateTimeStart:'',
            updateTimeEnd:'',
            formatAddress:values.formatAddress
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
                    <Col span={8} key={1}>
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
                    <Col span={8} key={3}>
                    <Form.Item label="日期">
                        {getFieldDecorator('date', {
                            rules: [{ type: 'array', required: false, message: '必须输入!' }],
                        })(<RangePicker placeholder={['开始日期','结束日期']} />)}
                    </Form.Item>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
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
