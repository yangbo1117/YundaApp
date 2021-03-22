import React from 'react'
import { Layout,Row,Col } from 'antd';
import NavSide from '../../components/NavSide'
import Footer from '../../components/Footer'
import Tabs from '../../components/Tabs'
import Home from '../home/index.js'
import './index.scss'


class Admin extends React.Component{
    constructor(props) {
        super(props);
        this.newTabIndex = 1;
        let arr = <Home key="home"></Home>
        arr = [arr]
        const panes = [
          { title: '首页', content: {arr}, key: '/tv/all/home', closable: false }
        ];
        this.state = {
          panes,
          activeKey:'/tv/all/home',
        };
      }
    addTab(data,title,path){
      console.log(title)
      const pane = this.state.panes.filter(pane => pane.title === title);
      if(pane.length<1){
        const { panes } = this.state;
        const activeKey = path;
        const arr = [data]
        panes.push({ title: title, content: {arr}, key: activeKey });
        this.setState({ panes, activeKey });
      }else{
        this.setState({activeKey:path });
      }
    }
    //修改为当前的tab
    changeKey(key){ 

    }
    removeTab(data){
        let targetKey = data;
        let { activeKey } = this.state;
        let lastIndex;
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
        }
        this.setState({ panes, activeKey });
    }

    onChange(activeKey) {
        this.setState({ activeKey});
      };
    render(){
        return(
          <Row className="container">
            <Layout>
              <Col span={4} className="nav-left">
                  <NavSide addTab={this.addTab.bind(this)}></NavSide>
              </Col>
              <Col span={20} className="main">
                  <Layout>
                  <Row className="content">
                          <Tabs {...this.state} 
                          removeTab={this.removeTab.bind(this)}
                          onChange ={this.onChange.bind(this)}>
                          </Tabs>
                  </Row>       
                  <Footer></Footer>
                  </Layout>
              </Col>                
            </Layout>
        </Row>
        )
    }
}
export default Admin