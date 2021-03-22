import React from 'react'
import { Tabs } from 'antd';
import Main from '../../components/Main'
import './index.scss'

const { TabPane } = Tabs;

class TabHeader extends React.Component {
  
  onChange = activeKey => {
    this.props.onChange(activeKey);
  };
  remove = targetKey => {
    console.log(targetKey)
    this.props.removeTab(targetKey)
  };

  render() {
    console.log(this.props)
    return (
      <div>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.props.activeKey}
          type="editable-card"
          onEdit={this.remove}
        >
          {this.props.panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                <Main>
                  {pane.content.arr}
                </Main>
                        {/* {this.props.children} */}
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default TabHeader