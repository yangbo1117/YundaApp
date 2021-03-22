import React from 'react'
import { Form,DatePicker, Row, Col,Button} from 'antd';
import moment from 'moment';


class QueryForm extends React.Component {
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        if(!err){
            console.log('Received values of form: ', values);
            let frequencyDate = values.frequencyDate
            let params
            if(frequencyDate!==undefined){
              frequencyDate = frequencyDate.format('YYYYMMDD')
              params={
                  frequencyDate
                }
            }else{
              params={
                  frequencyDate:'all'
                } 
            }
            this.props.search(params)
        }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div>
             <Form className="ant-advanced-search-form " style={{border:'none',padding:5}} onSubmit={this.handleSearch}>
                <Row gutter={24}>
                    <Col span={6} offset={14} key={1}>
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
                    <Col span={4}  key={2}>
                         <Button type="primary" icon="search" htmlType="submit">
                        查询
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
