import React from 'react'
import { HashRouter, Route, Switch} from 'react-router-dom'
import QueryCollectPoint from './components/QueryCollectPoint.js'
import CollectPointDetail from './components/CollectPointDetail.js'
class CollectPoint extends React.Component{
   render(){   
    return(
      <HashRouter>
          <Switch>
            <Route path="/a/d" exact component={QueryCollectPoint}/>
            <Route path="/a/da" exact component={CollectPointDetail}/>
          </Switch>
      </HashRouter>
    )
   }
}
export default CollectPoint