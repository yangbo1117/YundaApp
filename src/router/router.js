import React from 'react'
import { HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import App from "../App.js"
import Admin from '../pages/admin/admin.js'
import SignMap from '../pages/signMapManger'
import SignMapBD from '../pages/signMapMangerBD'
import SignData from '../pages/signDataManger'
import AddFence from '../pages/addFenceManger'
import QueryAdds from '../pages/queryInitalAdd'
import CollectPoint from '../pages/collectPointManger'
import axios from '../axios'

export default class ERouter extends React.Component{
    constructor(props){
        super(props)
        this.state={
            Onoff:true
        }
    }
    setCookie (name, value){ 
        //设置名称为name,值为value的Cookie
        let expdate = new Date();   //初始化时间
        expdate.setTime(expdate.getTime()+1000*5);   //时间    
        document.cookie = name+"="+value+";expires="+expdate.toGMTString()+";path=/";
        //即document.cookie= name+"="+value+";path=/";   时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
                    }
    getCookie(name){
                let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)"); //正则匹配
                if(arr=document.cookie.match(reg)){
                    return unescape(arr[2]);
                }
                else{
                    return '';
                }
            }

    removeCookie=(name)=>{
            var d = new Date();
            d.setTime(d.getTime() - 10000);
            document.cookie = name + '=1; expires=' + d.toGMTString(); 
    }

    tick() {
        let search = window.location.search
        let param=''
        if(search!==''){
           let arr = search.slice(1).split('=')
           param = arr[1]
           this.setCookie("JSESSIONID",param)
        }
        console.log(param)
        let url = 'base/province'
        //let baseApi =  'http://10.20.28.3:8060/tv/'
        axios.get({
            url
        }).then((data)=>{
            let sessionId = this.getCookie('JSESSIONID')
            if(data.result === false && sessionId=== '' ){
                window.location.href = data.data.casRedirect+"?redirectUrl="+encodeURI(window.location.href)
               }
        })
      }
      beforeunload =(e)=> {
          console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
        this.removeCookie("JSESSIONID")
        let confirmationMessage = '你确定离开此页面吗?';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    componentDidMount(){    
            console.log("登录")
            let search = window.location.search
            let param=''
            if(search!==''){
               let arr = search.slice(1).split('=')
               param = arr[1]
               this.setCookie("JSESSIONID",param)
            }
            console.log(param)
            let url = 'base/province'
            // let baseApi =  'http://10.20.28.3:8060/tv/'
            axios.get({
                url
            }).then((data)=>{
                console.log(data)
                let sessionId = this.getCookie('JSESSIONID')
                if(data.result === false && sessionId === ''){
                    window.location.href = data.data.casRedirect+"?redirectUrl="+encodeURI(window.location.href)
                   }
            })
            this.interval = setInterval(() => this.tick(), 1000*60*20); 
            window.addEventListener('beforeunload', this.beforeunload);
            // let t1 = setTimeout(() => {
            //     this.removeCookie("JSESSIONID")
            //     clearTimeout(t1)
            // },1000*60*10);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
      }

    render(){      
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route  path="/" render={()=>
                            <Admin>
                                <Switch>   
                                    <Route path="/tv/all/queryAdd" component={QueryAdds}/>    
                                    <Route path="/tv/amap/mapManger" component={SignMap}/>
                                    <Route path="/tv/amap/dataManger" component={SignData}/>
                                    <Route path="/tv/amap/fenceManger" component={AddFence}/>
                                    <Route path="/tv/amap/collectPointManger" component={CollectPoint}/>
                                    <Route path="/tv/bmap/mapManger" component={SignMapBD}/>
                                </Switch>
                            </Admin>                    
                            }/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}