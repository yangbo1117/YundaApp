import React from 'react'

class NoData extends React.Component{
    render(){
        return (
            <div className="noInfo">
                 <img  src={require('../../../asset/images/noInfo.png')} alt=""/>
                 <p className="alert">
                    很抱歉当前内容为空，请重新操作~
                 </p>
            </div> 
        )
    }
}
export default NoData