import React, { Component } from 'react';

import './index.scss';

interface Props {
  title: string;
  left?: React.ReactNode;
}

class Header extends Component<Props, {}> {
  render() {
    const { title, left } = this.props
    return (
      <div className="m-header">
        {left && <div className="left">{left}</div>}
        {title}
      </div>
    );
  }
}

export default Header;