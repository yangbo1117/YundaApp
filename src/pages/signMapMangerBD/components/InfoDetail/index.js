import React from 'react'
import './index.scss'
import {Modal, Button } from 'antd'
class InfoDetail extends React.Component{ 
    constructor(props){
        super(props)
        this.state={
            isShow:false
        }
    }

    kkk=()=>{
        this.props.kkk()
    }
    render(){
        return(
            <div id="containers" style={{display: this.state.isShow ? "block" : "none"}} >
                <dt>代收点</dt>
                <img className="close" onClick={this.close.bind(this)} src={require('../../../../asset/images/close.png')} alt=""></img>
            {            
             this.props.collectPointDetailList.map((item,index)=>{
                return(
                <dl className="content" key={index}>                
                        <dd>
                        <span>类型：</span>
                        <span>{item.collectType}</span>
                        </dd>
                        <dd>
                            <span>来源：</span>
                            <span>{item.collectSourceName}</span>
                        </dd>
                        <dd>
                            <span>名称：</span>
                            <span>{item.collectName}</span>
                        </dd>
                        <dd>
                            <span>位置：</span>
                            <span>{item.collectLocation}</span>
                        </dd>         
                       
                        <dd>
                            <span> 经纬度：</span>
                            <span>{item.collectLngLat}</span>
                        </dd>
                 </dl>
                    )
                })
            }
            <Button onClick={this.kkk} style={{marginLeft:"1.5rem"}} type="primary" key="1">纠偏</Button>
            <Button onClick={this.close.bind(this)} style={{marginLeft:"10px"}} key="3">取消</Button>

        </div>
        )  
       
    }
    close(){
        this.setState({ 
            isShow:false
        },()=>{
            this.props.isClose()
        })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.isShow===true){
            this.setState({
                isShow:true
            })
        }
    }
}

export default InfoDetail