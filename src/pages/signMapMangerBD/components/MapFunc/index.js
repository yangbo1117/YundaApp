import React from 'react'
import { Checkbox } from 'antd';
import './index.scss'
class MapFunc extends React.Component{

    constructor(props){
        super(props)
        this.state={
            originChecked:true,
            fenceChecked:true,
            collectPointChecked:true,
            expressBoxChecked:true,
            stageChecked:true,
            isShow:true
        }
    }

    onChange(e){
        let value = e.target.value
        console.log(value)
        if(e.target.checked){
            console.log(e.target.checked)
            if(value ==='1'){
                this.setState({
                    originChecked:true,
                },()=>{
                    console.log("chufale1")
                        this.props.changeFun({

                            fenceChecked:this.state.fenceChecked,
                            collectPointChecked:this.state.collectPointChecked,
                            originChecked:this.state.originChecked,

                        })
                        this.props.showMassMarker()             
                })
               
            }else if(value ==='2'){
                this.setState({
                    fenceChecked:true,
                },()=>{
                    this.props.changeFun({
                        fenceChecked:this.state.fenceChecked,
                        collectPointChecked:this.state.collectPointChecked,
                        originChecked:this.state.originChecked,
                        
                
                    })
                    this.props.getFenceData('1')
                })
              
            }else if(value ==='3'){
                this.setState({
                    collectPointChecked:true,
                },()=>{
                    this.props.changeFun({
                        fenceChecked:this.state.fenceChecked,
                        collectPointChecked:this.state.collectPointChecked,
                        originChecked:this.state.originChecked,
                
                    })
                    this.props.getFenceData('2')
                })            
            }else if(value ==='4'){
                this.setState({
                    expressBoxChecked:true,
                })
            }else if(value ==='5'){
                this.setState({
                    stageChecked:true,
                })
            }
        }else{
            if(value ==='1'){
                this.setState({
                    originChecked:false,
                },()=>{
                    console.log("chufale2")
                    this.props.changeFun({
                        fenceChecked:this.state.fenceChecked,
                        collectPointChecked:this.state.collectPointChecked,
                        originChecked:this.state.originChecked,
                        
                
                    })
                    this.props.removeMassMarker()
                })
            
            }else if(value ==='2'){
                this.setState({
                    fenceChecked:false,
                },()=>{
                    this.props.changeFun({
                        fenceChecked:this.state.fenceChecked,
                        collectPointChecked:this.state.collectPointChecked,
                        originChecked:this.state.originChecked,
                
                    })
                    this.props.removeFenceData()
                })
              
            }else if(value ==='3'){
                this.setState({
                    collectPointChecked:false,
                },()=>{
                    this.props.changeFun({
                        fenceChecked:this.state.fenceChecked,
                        collectPointChecked:this.state.collectPointChecked,
                        originChecked:this.state.originChecked,
                
                    })
                    this.props.removeCollectPoint()
               })
            
            }else if(value ==='4'){
                this.setState({
                    expressBoxChecked:false,
                })
            }else if(value ==='5'){
                this.setState({
                    stageChecked:false,
                })
            }
        }
    }
    //显示隐藏label
    changeLabel(){
        console.log()
        this.setState({
            isShow:!this.state.isShow
        })
    }

    // hide(){
    //     if(this.state.originChecked){
    //         console.log(1119)
    //         this.props.showMassMarker()
    //     }else{
    //         console.log(120)
    //         this.props.removeMassMarker()
    //     }
    // }
    render(){
        return(
                <div className="funcLabel">
                    <div style={{marginLeft:".7rem"}} className="funcLabel">
                            <Checkbox style={{opacity:this.state.isShow===true?'1':'0',transform:this.state.isShow===true?"translateX(0px)":"translateX(300px)",transition:".5s"}} onChange={this.onChange.bind(this)}  value="1" checked={this.state.originChecked}>签收原始点</Checkbox>
                            <Checkbox style={{opacity:this.state.isShow===true?'1':'0',transform:this.state.isShow===true?"translateX(0px)":"translateX(300px)",transition:".5s"}} onChange={this.onChange.bind(this)} value="2" checked={this.state.fenceChecked}>业务员围栏</Checkbox>
                            <Checkbox style={{opacity:this.state.isShow===true?'1':'0',transform:this.state.isShow===true?"translateX(0px)":"translateX(300px)",transition:".5s"}} onChange={this.onChange.bind(this)} value="3" checked={this.state.collectPointChecked}>第三方代收点</Checkbox>
                            <Checkbox style={{opacity:this.state.isShow===true?'1':'0',transform:this.state.isShow===true?"translateX(0px)":"translateX(300px)",transition:".5s"}} onChange={this.onChange.bind(this)} value="4" checked={this.state.expressBoxChecked}>快递柜</Checkbox>
                            <Checkbox style={{opacity:this.state.isShow===true?'1':'0',transform:this.state.isShow===true?"translateX(0px)":"translateX(300px)",transition:".5s"}} onChange={this.onChange.bind(this)} value="5" checked={this.state.stageChecked}>驿站</Checkbox>  
                    </div>                          
                    <label className="mapChoose"style={{position: 'relative',float:'right'}} onClick={this.changeLabel.bind(this)}>
                        <span></span>
                        <div className="bubble"></div>
                    </label>
                </div>
        )
    }
    componentWillReceiveProps(nextprops){
        if(nextprops.checkBoxReset>this.props.checkBoxReset){
            console.log(22)
        /*     if(this.state.originChecked===true){
                this.props.showMassMarker()
            }else{
                this.props.removeMassMarker()
            } 
            if(this.state.fenceChecked===true){
             // this.props.getFenceData('1')
            }else{
                this.props.removeFenceData()
            } 
            if(this.state.collectPointChecked===true){
             // this.props.getFenceData('2')
            }else{
                this.props.removeCollectPoint()
            }  */
        }
      
    }
}

export default MapFunc