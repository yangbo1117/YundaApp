import React from 'react'
import './index.scss'
class InfoDetail extends React.Component{ 
    constructor(props){
        super(props)
        this.state={
            isShow:false
        }
    }
    render(){
        return(
            <div id="containers" style={{display: this.state.isShow ? "block" : "none"}}>
                <dt>代收点</dt>
                <img className="close" src={require('../../../../asset/images/close.png')} alt="" onClick={this.close.bind(this)}></img>
            {            
             this.props.collectPointDetailList.map((item,index)=>{
                 console.log(item)
                return(
                <dl className="content" key={index}>                
                        <dd>
                            <span>名称：</span>
                            <span>{item.collectName}</span>
                        </dd>
                        <dd>
                            <span>来源：</span>
                            <span>{item.collectSourceName}</span>
                        </dd>
                        <dd>
                        <span>类型：</span>
                        <span>{item.collectType}</span>
                        </dd>
                        <dd>
                            <span> 经纬度：</span>
                            <span>{item.collectLngLat}</span>
                        </dd>
                        <dd>
                            <span>位置：</span>
                            <span>{item.collectLocation}</span>
                        </dd>         
                 </dl>
                    )
                })
            }
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