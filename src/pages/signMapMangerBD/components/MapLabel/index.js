import React from 'react'
import './index.scss'
class MapLabel extends React.Component{
    // constructor(props){
    //     super(props)
    // }
    componentDidMount() {
        let initalEle = this.refs.initalTab;
        // let cxEle = this.refs.cxTab;
        // let wwEle = this.refs.wwTab;
        initalEle.addEventListener('click',()=>{
            this.props.changeMap('1')
            this.getPointData('1')
            initalEle.className = 'liChecked'
            //cxEle.className = ''
           // wwEle.className = ''
        })   
     /*    cxEle.addEventListener('click',()=>{
            this.props.changeMap('2')
            this.getPointData('2')
            cxEle.className = 'liChecked'
            wwEle.className = ''
            initalEle.className = ''
         })  
         wwEle.addEventListener('click',()=>{
            this.props.changeMap('3')
            this.getPointData('3')
            wwEle.className = 'liChecked'
            initalEle.className = ''
            cxEle.className = ''
        })  */ 
        }
        getPointData(type){
            this.props.getPointData(type)
        }
    render(){
        return(
            <div style={{position:"relative"}}>
                <ul id="container">
                    <li ref='initalTab' className="liChecked">业务员签收点原始结果图</li>
             {/*        <li ref='cxTab'>业务员签收点抽稀结果图</li>
                    <li ref='wwTab'>业务员签收点外围结果图</li> */}
                </ul>
            </div>
        )
    }
    
}
export default MapLabel
