import React from 'react';
import { Layout } from 'antd';
const {  Content } = Layout;
class Main extends React.Component{
    render(){
        return(
              <Content style={{ margin: '0px 16px 0' }}>
                <div style={{ padding: 24, background: '#fff', minHeight:document.body.clientHeight-80}}>
                    {this.props.children}
                </div>
              </Content>
        )
    }
}
export default Main