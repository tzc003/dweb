import React, {Component} from 'react';
import './indhex.scss'

function RenderTabs(tabs, tab, changeTabs) {
  return tabs.map((item, idx) => {
    if (!item.isshow) {
      return null;
    }
    return (
      <li
        key={item.index}
        className={tab === idx ? 'active' : ''}
        onClick={() => {
          changeTabs(idx)
        }}
      >
        {item.name}{idx}
      </li>
    )
  })
}

function showMain(idx) {
  switch (idx) {
    case 0:
      return <div>我是tab {idx}</div>
    case 1:
      return <div>我是tab {idx}</div>
    case 2:
      return <div>我是tab {idx}</div>
    default:
      break;
  }
}

interface State {
  tab ?: number;
  tabs ?: any
}

class TabChange extends Component<any, State> {
  constructor(props) {
    super(props)
    this.state = {
      tab: 0,
      tabs:[
        {name: 'tab', index: 0, isshow: true},
        {name: 'tab', index: 1, isshow: true},
        {name: 'tab', index: 2, isshow: true}
      ]
    }
  }

  changeTab = (idx) => {
    console.log(idx);
    this.setState({
      tab: idx
    });
  }

  render() {
    const {tab, tabs} = this.state;
    return (
      <div className="tabchange-box">
        <ul>
          {RenderTabs(tabs, tab, this.changeTab)}
        </ul>
        {showMain(tab)}
      </div>
    )
  }
}

export default TabChange;
