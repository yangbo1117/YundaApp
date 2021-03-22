import React from 'react'
import { Layout } from 'antd';
const {  Footer } = Layout;

class FooterYD extends React.Component{
    render(){
        return(
            <Footer style={{textAlign: 'center',fontSize:'0.12rem',padding: '10px 23px' }}>© dongpu.com - 2019-03 </Footer>
        )
    }
}
export default FooterYD