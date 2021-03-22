
import React from 'react'
import { HashRouter, Route, Switch} from 'react-router-dom'
import QueryAdd from './components/QueryAdd.js'
class QueryAdds extends React.Component{
   render(){
     
    return(

      <HashRouter>
          <Switch>
            <Route path="/tv/all/queryAdd" exact component={QueryAdd}/>
          </Switch>
      </HashRouter>
    )
   }
}
export default QueryAdds