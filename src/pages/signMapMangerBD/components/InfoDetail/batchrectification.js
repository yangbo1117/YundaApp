import React from 'react'
import './index.scss'
import {Modal, Button } from 'antd'
class Batchrectification extends React.Component{ 
    constructor(props){
        super(props)
        this.state={
            isPoint:false
        }
    }


    render(){      
        return(
            <div id="containers" style={{display: this.state.isPoint ? "block" : "none"}} >
                <dt style={{textAlign:"center"}}>信   息</dt>
                <img className="close" onClick={this.closse.bind(this)} src={require('../../../../asset/images/close.png')} alt=""></img>
                <Button  style={{marginLeft:"1rem"}} type="primary" key="1">纠偏</Button>
                <Button  style={{marginLeft:"10px"}} key="2">删除</Button>
                <Button style={{marginLeft:"10px"}} key="3">取消</Button>
         </div> 
        )  
       
    }
    closse(){
        this.setState({ 
            isPoint:false
        },()=>{
            this.props.isClosse()
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.isPoint===true){
            this.setState({
                isPoint:true
            })
        }
    }
}

export default Batchrectification