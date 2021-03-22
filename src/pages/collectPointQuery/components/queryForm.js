import React from 'react'
import { Form, Row, Col, Input, Button, Icon,Select } from 'antd';
const { Option } = Select;
class QueryForm extends React.Component {
        constructor(props){
            super(props)
            this.state={
                
            }
        }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      let params = {
        cityId: values.cityId,
        collectCode: values.collectCode,
        collectName: values.collectName,
        companyCode: values.companyCode,
        companyName: values.companyName,
        provinceId: values.provinceId,
        status: values.status
      }
      this.props.search(params,{
          pageSize:'',
          current:''
      })
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const stateList=['正常','关闭']
    return (
        <div>
             <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24}>
                <Col span={6} key={1}>
                        <Form.Item label='省'>
                            {getFieldDecorator('provinceId', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Input placeholder="请输入业务省" />)}
                        </Form.Item>
                    </Col>

                    <Col span={6} key={2}>
                        <Form.Item label='市'>
                            {getFieldDecorator('cityId', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Input placeholder="市" />)}
                        </Form.Item>
                    </Col>

                    <Col span={6} key={3}>
                        <Form.Item label='站点编码'>
                            {getFieldDecorator('collectCode', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Input placeholder="站点编码" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6} key={4}>
                        <Form.Item label='站点名称'>
                            {getFieldDecorator('collectName', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Input placeholder="站点名称" />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={6}  key={5}>
                        <Form.Item label='品牌编码'>
                            {getFieldDecorator('companyCode', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Input placeholder="品牌编码" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  key={6}>
                        <Form.Item label='品牌名称'>
                            {getFieldDecorator('companyName', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Input placeholder="品牌名称" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  key={7}>
                        <Form.Item label='状态'>
                            {getFieldDecorator('status',{ initialValue:0},{     
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Select
                                placeholder="请选择状态"
                                filterOption={false}
                            >
                              { stateList.map((item,index) =>
                                <Option value={index} key={index}>{item}</Option>
                                )}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={6} key={8} style={{ textAlign: 'right' }}>
                        <Button type="primary" icon="search" htmlType="submit">
                        查询
                        </Button>
                        <Button className="reset" style={{ marginLeft: 8 }} type="primary" ghost="true" icon="sync" onClick={this.handleReset}>
                        重置
                        </Button>
                    </Col>
                </Row>  
                 
                {/* <Col span={6}  key={1}>
                        <Form.Item label='省'>
                            {getFieldDecorator('frequencyTime', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Select
                                placeholder="请选择省"
                                filterOption={false}
                            >
                              { stateList.map((item) =>
                                <Option value={item.value} key={item.value}>{item.name}</Option>
                                )}
                            </Select>)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  key={2}>
                        <Form.Item label='市'>
                            {getFieldDecorator('frequencyTime', {
                            rules: [
                                {
                                required: false,
                                message: '必须输入!',
                                },
                            ],
                            })(<Select
                                placeholder="请选择市"
                                filterOption={false}
                            >
                              { stateList.map((item) =>
                                <Option value={item.value} key={item.value}>{item.name}</Option>
                                )}
                            </Select>)}
                        </Form.Item>
                    </Col> */}
                       
            </Form>
        </div>
     
    );
  }
}
const Forms = Form.create({})(QueryForm);
export default Forms
