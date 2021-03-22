import React from 'react';
import { Layout, Menu} from 'antd';
import { NavLink } from 'react-router-dom'
import './index.scss';
import MenuConfig from '../../configs/menuConfigs'
//import QueryAdd from '../../pages/queryInitalAdd'
import Trajectory from '../../pages/recommendedTrajectory/recommendedTrajectory'
import QueryAdd from '../../pages/queryInitalAdd/components/QueryAdd.js'
import CollectPoint from '../../pages/collectPointManger'
import SignMap from '../../pages/signMapManger'
import SignMapBD from '../../pages/signMapMangerBD'
import SignData from '../../pages/signDataManger'
import AddFence from '../../pages/addFenceManger'
import TrPlayback from '../../pages/arackPlayback/Trackplayback'
import CorrectResultQuery from '../../pages/correctResult/correctResultQuery.js'
import CorrectResultLog from '../../pages/correctResult/correctResultLog'
import CollectPointManger from '../../pages/collectPointManagerBD/collectPointQuery'
import Chart from '../../pages/elseManager/chart.js'
import CollectPointQuery from '../../pages/collectPointQuery'
const {  Sider } = Layout;
const { SubMenu } = Menu;
export default class NavSide extends React.Component{
    constructor(props) {
      super(props);
      this.newTabIndex = 0;
      const panes = [
     
      ];
      this.state = {
        panes,
      };
    }
    addTab(data,title){ 
      let pane
      switch(data){
        case '/tv/all/queryAdd':
          pane = <QueryAdd key={data}></QueryAdd>;
          break;
        case '/tv/amap/mapManger':
          pane = <SignMap key={data}></SignMap>;
          title = title+'（高德）'
          break;
        case '/tv/all/recommendedTrajectory':
            pane = <Trajectory key={data}></Trajectory>;
            break;
        case '/tv/amap/dataManger':
          pane = <SignData key={data}></SignData>;
          break;
        case '/tv/amap/fenceManger':
          pane = <AddFence key={data}></AddFence>;
          break;
        case '/tv/amap/collectPointManger':
          pane = <CollectPoint key={data}></CollectPoint>;
          break;
        case '/tv/bmap/mapManger':
          pane = <SignMapBD key={data}></SignMapBD>;
          title = title+'（百度）'
          break;
        case '/tv/correctResult/query':
          pane = <CorrectResultQuery key={data}></CorrectResultQuery>;
          break;
        case '/tv/correctResult/log':
          pane = <CorrectResultLog key={data}></CorrectResultLog>;
          break;
        case '/tv/elseManager/statistics':
          pane = <Chart key={data}></Chart>;
          break;
        case '/tv/bmap/collectPointManager':
          pane = <CollectPointManger key={data}></CollectPointManger>;
          break;
        case '/tv/all/queryCollectPoint':
          pane = <CollectPointQuery key={data}></CollectPointQuery>;
          break;   
        case '/tv/amapJK/Trackplayback':
          pane = <TrPlayback key={data}></TrPlayback>;
          break; 
        default :
          pane = <QueryAdd key={data}></QueryAdd>;
      }
        this.props.addTab(pane,title,data)
      
     
    }
    componentWillMount(){
        const menuTreeNode = this.renderMenu(MenuConfig);
        this.setState({
            menuTreeNode
        })
    }
    //侧边栏菜单渲染
    renderMenu(data){
        return data.map((item,index)=>{
          switch(index){
            case 0:
              item.src =require('../../asset/images/addressIcon.png')
              break;
            case 1:
              item.src =require('../../asset/images/baiduIcon.png')
              break;
            case 2:            
              item.src =require('../../asset/images/gaodeIcon.png')
              break;
            case 3:            
              item.src =require('../../asset/images/addressIcon.png')
              break;
            case 4:            
            item.src =require('../../asset/images/elseManager.png')
            break;
            case 5:                  
            item.src =require('../../asset/images/correctResult.png')
            break;
            default:
                item.src =require('../../asset/images/addressIcon.png')
          }
            if(item.children){
                return (
                     <SubMenu inlineIndent="20" title={
                      <span>
                        <img className="AddIcon" src={item.src} alt='暂无图片'/>
                        <span className="spanAdd">{item.title}</span>
                      </span>} key={item.path}>
                  { this.renderMenu(item.children)}
              </SubMenu>
                )
            }
            return <Menu.Item title={item.title} key={item.path} onClick={this.addTab.bind(this,item.path,item.title)}>
                    <NavLink to={item.path}>{item.title}</NavLink>
                   </Menu.Item>
        })
    }
    render(){
        return (
            <Sider
              collapsedWidth="0"
              width="100%"
              onBreakpoint={broken => {
                console.log(broken);
              }}
              onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
              }}
            >
              <div className="logo">
                <img className="logoImg" src={require('../../asset/images/asideLogo.png')} alt=""></img>
              </div>
              <Menu theme="light" mode="inline" inlineIndent="20" defaultSelectedKeys={['4']}>
                    {this.state.menuTreeNode}
              </Menu>
            </Sider>
        )
    }
}