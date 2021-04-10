import React, { Component } from 'react';

import failPng from '@/images/fail.png';

import './index.scss';

interface Props {
  txt?: string;
}

class Fail extends Component<Props, {}> {
  render() {
    const { txt } = this.props
    return (
      <div className="p-fail">
        <img src={failPng} alt="" />
        <span className="txt">{txt || 'Timeout, please re-initiate the recharge'}</span>
      </div>
    );
  }
}

export default Fail;