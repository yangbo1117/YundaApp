import React from 'react'
import './index.scss'
import {Modal, Button } from 'antd'
class pointClick extends React.Component{ 
    constructor(props){
        super(props)
        this.state={
            isPoint:false
        }
    }

    jp=()=>{
        this.props.lll()
    }

    render(){      
        return(
            <div id="containers" style={{display: this.state.isPoint ? "block" : "none"}} >
                <dt style={{textAlign:"center"}}>信   息</dt>
                <img className="close" onClick={this.closse.bind(this)} src={require('../../../../asset/images/close.png')} alt=""></img>
            {/* {            
             this.props.collectPointDetailList.map((item,index)=>{
                 console.log(item)
                return( 
                                nowLnglat:res[i].point.lng+'，'+res[i].point.lat,
                                nowMailNo:res[i].mailNo,
                                nowSignTime:res[i].batchTime,
                                nowBranchId:res[i].branchId,
                                nowDealmanId:res[i].dealmanId,
                                nowSignNum:res[i].signNum,
                                nowBranchName:res[i].branchName,
                                nowDealmanName:res[i].dealmanName,
                                nowDetailObj:data,
                    
                    */}
                <dl className="content">                
                        <p>
                            运单号：{this.props.nowMailNo}
                        </p>

                        <p>
                            经纬度：{this.props.nowLnglat}
                        </p>

                        <p>
                            AOI名称：{this.props.nowDetailObj.aoiName}
                        </p> 

                        <p>
                            AOI经纬度：{this.props.nowDetailObj.aoiLocation}
                        </p>    

                        <p>
                            签收时间：{this.props.nowSignTime}
                        </p>
                        <p>
                            签收次数：{this.props.nowSignNum}
                        </p>
                        <p>
                            运单来源：{this.props.nowDetailObj.source}
                        </p> 
                        <p>
                            原始地址：{this.props.nowDetailObj.address}
                        </p>            
                 </dl>
                     {/* )
                })
            } */}
            <Button onClick={this.jp} style={{marginLeft:"1rem"}} type="primary" key="1">纠偏</Button>
            <Button onClick={this.props.confirmDelete} style={{marginLeft:"10px"}} key="2">删除</Button>
            <Button onClick={this.closse.bind(this)} style={{marginLeft:"10px"}} key="3">取消</Button>
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

export default pointClick